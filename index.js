module.exports = function (options) {
  var randFn = (options && options.fn) || Math.random;

  function random(schema, options) {
    var path = (options && options.path) || 'random';
    var field = {};
    field[path] = {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: function () { return [randFn(), randFn()] } }
    };
    var index = {};
    index[path] = '2dsphere';

    schema.add(field);
    schema.index(index);

    schema.statics.findRandom = function (query, callback) {
      var self = this;
      var coords = [randFn(), randFn()];

      if (typeof query === 'function') {
        callback = query;
        query = {};
      }

      query[path] = query[path] || {
        $near: {
          $geometry: { type: 'Point', coordinates: coords }
        }
      };

      self.findOne(query, function (err, doc) {
        if (err) return callback(err);
        callback(null, doc);
      });
    };
  }

  return random;
}