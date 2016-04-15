var url = require('url');
var express = require('express');
var app = express();

var http = require('https');

var dburl = 'flickrphotos';
var collections = ['photos'];
var mongojs = require('mongojs');
var db = mongojs(dburl, collections);

var flickr = require('./flickr.js');
var upload = require('./upload.js');

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
  flickr.getPhotoInfo(http, "26409172255", function(result){
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
