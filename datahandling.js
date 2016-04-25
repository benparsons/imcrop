(function() {


  var datahandling = function () {};

  datahandling.prototype.insertDataAfterImageSave =
   function(db, metadata, callback) {
     db.photos.insert([metadata], function(err, result) {
        callback(err, result)
      });
  };

  datahandling.prototype.disableSourceImage =
    function(db, id, callback) {
      db.photos.update(
        {id: id.toString(), title:null}, // query
        {
          $set: { // fields to update
            disabled: true
          }
        },
        {multi: true}, // multiple documents updated
        function(err, result) {
          callback(err, result);
        });
    };

    datahandling.prototype.getFullImageList =
      function(db, callback) {
        db.photos.find({title: {$exists: true}}, function(err, result) {
          callback(err, result);
        });
      };


  module.exports = new datahandling();
}());
