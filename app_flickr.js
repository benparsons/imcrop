var express = require('express');
var url = require('url');
var app = express();

var dburl = 'flickrphotos';
var collections = ['photos'];
var mongojs = require('mongojs');
var db = mongojs(dburl, collections);

var http = require('https');

var getPhotoInfo = function(photo) {
  var result = {};

  var photoGetInfoURL = "https://api.flickr.com/services/rest/?" +
    "method=flickr.photos.getInfo&" +
    "api_key=" + API_KEY + "&" +
    "photo_id=" + photo.id + "&" +
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
            console.log(flickrResponse.tags.tag);
            console.log(result)
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
    return result;
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
}

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.get('*', function (req, res) {
    res.sendfile('.' + req.path);
});

var server = app.listen(5050, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);

});
