var url = require('url');
var express = require('express');
var app = express();


var dburl = 'flickrphotos';
var collections = ['photos'];
var mongojs = require('mongojs');
var db = mongojs(dburl, collections);

var flickr = require('./flickr.js');

app.get('/list-empty-flickr-ids', function(req, res) {
  flickr.findEmptyIds(db, function(result) {
    res.send(result);
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
