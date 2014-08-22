var assert = require('assert');
var mongoose = require('mongoose');
var random = require('../index');

mongoose.connect('mongodb://localhost/test');

var Schema = new mongoose.Schema({}, { strict: false });
Schema.plugin(random, { path: 'r' });
var Test = mongoose.model('Test', Schema);

function dist(a, b) {
	return Math.sqrt(
			Math.pow(b[0] - a[0], 2) +
			Math.pow(b[1] - a[1], 2)
	);
}

describe('Model#findRandom()', function () {
	afterEach(function (done) {
		Test.remove({}, function (err) {
			assert.ifError(err);
			done();
		});
	});

	it('should return a usable `mongoose.Query` object', function (done) {
		var docs = [{
			name: 'bob',
			r: {
				coordinates: [0.95, 0.95]
			}
		}, {
			name: 'bobby',
			r: {
				coordinates: [0.90, 0.95]
			}
		}, {
			name: 'billy',
			r: {
				coordinates: [0.85, 0.95]
			}
		}];

		docs = docs.map(function (d) {
			return new Test(d);
		});

		var bob = docs[0];
		var bobby = docs[1];
		var billy = docs[2];

		Test.create(docs, function (err) {
			if (err) {
				return done(err);
			}
			var query = Test.findRandom({ name: /b.*/ig }, { name: 0 });
			query.limit(2).exec(function (err, returnDocs) {
				assert.ifError(err);
				assert(returnDocs.length === 2);
				assert(query instanceof mongoose.Query);

				returnDocs.forEach(function (doc) {
					assert(doc.name === undefined);
				});

				done();
			});
		});
	});

	it('should work with no arguments', function (done) {
		var query = Test.findRandom().limit(10).skip(5).exec(function (err, docs) {
			assert.ifError(err);
			assert(docs && docs.length === 0);
			done();
		});
	});

  it('should return the closest document', function (done) {
    var docs = [];
    var coords, d;

    for (var i = 0; i < 100; i++) {
	    coords = [Math.random(), Math.random()];
      d = dist(coords, [1, 1]);
      docs.push({ r: { type: 'Point', coordinates: coords }, dist: d });
    }

    Test.create(docs, function (err) {
      assert.ifError(err);
      Test.findRandom({
        r: {
          $near: {
            $geometry: { type: 'Point', coordinates: [1, 1] }
          }
        }
      }, {}, { limit: 1 }, function (err, actual) {
        assert.ifError(err);
        Test.findOne().sort('dist').exec(function (err, expected) {
          assert.ifError(err);
          assert(actual[0].get('r.coordinates.0') === expected.get('r.coordinates.0'));
          assert(actual[0].get('r.coordinates.1') === expected.get('r.coordinates.1'));

	        done();
        });
      });
    });
  });
});