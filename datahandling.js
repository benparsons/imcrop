(function() {


  var datahandling = function () {};

  datahandling.prototype.insertDataAfterImageSave =
   function(db, metadata, callback) {
     db.photos.insert([metadata], function(err, result) {
        callback(err, result)
      });
  };


  module.exports = new datahandling();
}());
