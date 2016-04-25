var url = require('url');
var express = require('express');
var app = express();

var http = require('https');
var dburl;
if (process.env.MLABUSER && process.env.MLABPASSWORD) {
  dburl = process.env.MLABUSER + ':' + process.env.MLABPASSWORD +
  '@ds011271.mlab.com:11271/' + process.env.MLABUSER;
}
else {
  dburl = 'flickrphotos';
}

console.log('dburl: ' + dburl);

var collections = ['photos'];
var mongojs = require('mongojs');
var db = mongojs(dburl, collections);

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';


var flickr = require('./flickr.js');
var upload = require('./upload.js');
var datahandling = require('./datahandling.js');

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

app.post('/upload/s3', function(req, res) {
  upload.s3(req, AWS, function(err, data) {
    var result = {
      success: !err
    };
    result.data = data;
    if (err) result.err = err;

    res.send(result);
  })
});

app.get('/upload/insert-data', function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
//console.log("raw:    " + JSON.parse(query.metadata));
  datahandling.insertDataAfterImageSave(db, JSON.parse(query.metadata), function(result){
    res.send(result);
  });
});

app.get('/aws-test', function(req, res) {
  var s3bucket = new AWS.S3({params: {Bucket: 'flickrwall'}});
  s3bucket.createBucket(function() {
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

var server = app.listen(process.env.PORT || 3030, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);

});
