(function() {
  var flickr = function () {};

  flickr.prototype.findEmptyIds = function(db, callback) {
    db.photos.find({title: null}, function(err, result) {
      callback(result);
    });
  };

  module.exports = new flickr();
}());
