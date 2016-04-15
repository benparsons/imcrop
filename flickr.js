(function() {
  var API_KEY = "9e3fad4371ea21684576fa076388262b";

  var flickr = function () {};

  flickr.prototype.findEmptyIds = function(db, callback) {
    db.photos.find({title: null}, function(err, result) {
      callback(result);
    });
  };

  flickr.prototype.findRandomEmptyId = function(db, callback) {
    var skipRandom = Math.floor(Math.random() * 10);
    db.photos.find({title:null}).limit(-1).skip(skipRandom, function(err, result) {
      callback(result);
    });
  };

  flickr.prototype.loadFlickrIds = function (http, db, callback) {

    var photoSearchURL = "https://api.flickr.com/services/rest/?" +
          "method=flickr.photos.search&" +
          "api_key=" + API_KEY + "&" +
          "tags=calm&" +
          "license=4&" +
          "format=json&" +
          "nojsoncallback=1";

    http.get(photoSearchURL, function(res){
        var body = '';
        var output;
        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var flickrResponse = JSON.parse(body);
            console.log("Got a response: ", flickrResponse.photos.photo[0]);
            var mapped = flickrResponse.photos.photo.map(function(photo) {
              return {
                id: photo.id
              };
            });
            db.photos.insert(mapped);

            callback({sucess: true, count: mapped.length});
        });
    }).on('error', function(e){
      callback({success: false, err: e});
    });
  };

  flickr.prototype.getPhotoInfo = function(http, photo_id, callback) {
    var result = {};

    var photoGetInfoURL = "https://api.flickr.com/services/rest/?" +
      "method=flickr.photos.getInfo&" +
      "api_key=" + API_KEY + "&" +
      "photo_id=" + photo_id + "&" +
      "format=json&" +
      "nojsoncallback=1";

      http.get(photoGetInfoURL, function(res){
          var body = '';

          res.on('data', function(chunk){
              body += chunk;
          });

          res.on('end', function(){
              var flickrResponse = JSON.parse(body).photo;
              console.log("Got a response: ", flickrResponse);
              result.original_url = "http://farm" + flickrResponse.farm +
                ".staticflickr.com/" + flickrResponse.server + "/" +
                flickrResponse.id + "_" + flickrResponse.originalsecret +
                "_o." + flickrResponse.originalformat;
              result.flickrResponse = flickrResponse;
              callback({sucess: true, result: result});
          });
      }).on('error', function(e){
        callback({success: false, err: e});
      });
      //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
  }

  module.exports = new flickr();
}());
