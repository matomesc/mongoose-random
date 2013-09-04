module.exports = function (options) {
  var randFn = (options && options.fn) || Math.random;
  var randCoords = function () { return [randFn(), randFn()] }

  function random(schema, options) {
    var path = (options && options.path) || 'random';
    var field = {};
    field[path] = {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: randCoords }
    };
    var index = {};
    index[path] = '2dsphere';

    schema.add(field);
    schema.index(index);

    schema.statics.findRandom = function (query, callback) {
      var self = this;

      if (typeof query === 'function') {
        callback = query;
        query = {};
      }

      query[path] = query[path] || {
        $near: {
          $geometry: { type: 'Point', coordinates: randCoords() }
        }
      };

      self.findOne(query, function (err, doc) {
        if (err) return callback(err);
        callback(null, doc);
      });
    };

    schema.statics.syncRandom = function (callback) {
      var self = this;
      self.find({}, function (err, docs) {
        if (typeof callback === 'function' && err) return callback(err);
        docs.forEach(function(doc) {
          self.update({ _id: doc._id }, { $set: { random: { coordinates: randCoords(), type: 'Point' } } }).exec();
        });
        if (typeof callback === 'function') callback(null);
      });
    }
  }

  return random;
}