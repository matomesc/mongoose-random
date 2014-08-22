/**
 * @method random
 * @param {mongoose.Schema} schema
 * @param {Object}          options
 * @param {Function}        [options.fn=Math.random]
 * @param {String}          [options.path='random']
 */
function random(schema, options) {
	options = options || {};
	var randFn = options.fn || Math.random;
	var randCoords = function () { return [randFn(), randFn()] }
	var path = options.path || 'random';
	var field = {};
	field[path] = {
		type: { type: String, default: 'Point' },
		coordinates: { type: [Number], default: randCoords }
	};
	var index = {};
	index[path] = '2dsphere';

	schema.add(field);
	schema.index(index);

	/**
	 * @method findRandom
	 * @param {Object}    conditions
	 * @param {Object}    [fields]
	 * @param {Object}    [options]
	 * @param {Function}  [callback]
	 */
	schema.statics.findRandom = function (conditions, fields, options, callback) {
		var self = this;

		if (!conditions || typeof conditions === 'function') {
			conditions = {};
		}

		conditions[path] = conditions[path] || {
			$near: {
				$geometry: { type: 'Point', coordinates: randCoords() }
			}
		};

		var query = self.find.call(self, conditions, fields, options, callback);
		query.__random = { path: path, query: conditions[path] };
		return query;
	};

	/**
	 * @method syncRandom
	 * @param  callback
	 */
	schema.statics.syncRandom = function (callback) {
		var self = this;
		var stream = self.find({}).stream({ transform: transform });
		var result = {
			attempted: 0,
			updated: 0
		};
		var left = 0;
		var streamEnd = false;

		stream.on('data', function (doc) {
			result.attempted += 1;
			left += 1;
			doc.save(function (err) {
				if (err) {
					console.error(err.stack);
				} else {
					result.updated += 1;
				}

				left -= 1;
				if (streamEnd && !left) {
					return callback(null, result);
				}
			});
		}).on('error', function (err) {
			console.error(err.stack);
		}).on('end', function () {
			streamEnd = true;
		});
		return stream;
	};

	function transform(doc) {
		var update = {
			type: 'Point',
			coordinates: randCoords()
		};
		doc.set(path, update);
		return doc;
	}
}
module.exports = random;

/**
 * Merges keys from `objects` into `base`, without overwriting.
 *
 * @method  merge
 * @param   {Object}    base
 * @param   {[Object]}  [objects]*
 * @returns {Object}
 */
function merge(base) {
	var objects = [].slice.call(arguments, 1);
	objects.forEach(function (obj) {
		Object.keys(obj).forEach(function (key) {
			base[key] = base[key] === undefined ? obj[key] : base[key];
		});
	});
	return base;
}
