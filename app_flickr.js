var express = require('express');
var url = require('url');
var app = express();

var dburl = 'flickrphotos';
var collections = ['photos'];
var mongojs = require('mongojs');
var db = mongojs(dburl, collections);

var exec = require('child_process').exec;

var http = require('https');
var API_KEY = "9e3fad4371ea21684576fa076388262b";

app.get('/insert/output', function (req, res) {
  exec('node -v', function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
  });

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var result = query['name'];

    //db.frames.insert(JSON.parse(result));
    res.send(result);
});

app.get('/list-empty-flickr-ids', function(req, res) {
  db.photos.find({title: null}, function(err, result) {
		res.send(result);
	});
});

app.get('/load-flickr-ids', function(req, res) {
  var output;
  var photoSearchURL = "https://api.flickr.com/services/rest/?" +
        "method=flickr.photos.search&" +
        "api_key=" + API_KEY + "&" +
        "tags=calm&" +
        "license=4&" +
        "format=json&" +
        "nojsoncallback=1";

  http.get(photoSearchURL, function(res){
      var body = '';

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
          //output = getPhotoInfo(flickrResponse.photos.photo[0]);
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });

  res.send("output");
});

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
