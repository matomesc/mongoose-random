var assert = require('assert');
var mongoose = require('mongoose');
var random = require('../index');

mongoose.connect('mongodb://localhost/test');

var Schema = new mongoose.Schema({}, { strict: false });
Schema.plugin(random());
var Test = mongoose.model('Test', Schema);

describe('Model#findRandom()', function () {
  it('should return the closest document', function (done) {
    var docs = [];
    var a, b, dist;
    for (var i = 0; i < 100; i++) {
      a = Math.random();
      b = Math.random();
      dist = Math.sqrt((1 - a) * (1 - a) + (1 - b) * (1 - b));
      docs.push({ random: { type: 'Point', coordinates: [a, b] }, dist: dist });
    }
    Test.create(docs, function (err) {
      if (err) return done(err);
      Test.findRandom({
        random: {
          $near: {
            $geometry: { type: 'Point', coordinates: [1, 1] }
          }
        }
      }, function (err, actual) {
        if (err) return done(err);
        Test.findOne().sort('dist').exec(function (err, expected) {
          if (err) return done(err);
          assert(actual.get('random.coordinates')[0] === expected.get('random.coordinates')[0]);
          assert(actual.get('random.coordinates')[1] === expected.get('random.coordinates')[1]);
          done();
        });
      });
    });
  });
});