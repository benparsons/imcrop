var url = require('url');
var express = require('express');
var app = express();

var http = require('https');

var dburl = 'flickrphotos';
var collections = ['photos'];
var mongojs = require('mongojs');
var db = mongojs(dburl, collections);

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';


var flickr = require('./flickr.js');
var upload = require('./upload.js');

app.get('/get-random-empty-id', function(req, res) {
  flickr.findRandomEmptyId(db, function(result) {
    res.send(result);
  });
});

app.get('/list-empty-flickr-ids', function(req, res) {
  flickr.findEmptyIds(db, function(result) {
    res.send(result);
  });
});

app.get('/load-flickr-ids', function(req, res) {
  flickr.loadFlickrIds(http, db, function(result) {
    res.send(result);
  });
})

app.get('/get-photo-info', function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  flickr.getPhotoInfo(http, query.id, function(result){
    res.send(result);
  });
});

app.post('/upload/local', function(req, res){
  upload.local(req, function(err) {
    var result = {
      success: !err
    };
    if (err) result.err = err;

    res.send(result);
  })
});

app.get('/aws-test', function(req, res) {
  console.log("part1");
  var s3bucket = new AWS.S3({params: {Bucket: 'flickrwall'}});
    console.log("part2");
  s3bucket.createBucket(function() {
    console.log("part3");
    var params = {Key: 'myKey', Body: 'Hello!'};
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("Error uploading data: ", err);
      } else {
        console.log("Successfully uploaded data to flickrwall/myKey");
      }
    });
  });
});


app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.get('*', function (req, res) {
    res.sendfile('.' + req.path);
});

var server = app.listen(3030, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);

});
