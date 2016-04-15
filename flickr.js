(function() {
  var API_KEY = "9e3fad4371ea21684576fa076388262b";

  var flickr = function () {};

  flickr.prototype.findEmptyIds = function(db, callback) {
    db.photos.find({title: null}, function(err, result) {
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

  module.exports = new flickr();
}());
