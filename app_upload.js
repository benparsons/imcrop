var url = require('url');
var express = require('express');
var multiparty = require('multiparty');
var app = express();

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}


app.post("/path/to/upload", function(req, httpResponse, next){
  var form = new multiparty.Form();
   form.parse(req, function(err, fields, files) {
     //console.log(err);
     //console.log(fields);
     //console.log(files);

     //var base64Data = fields.croppedImage[0].replace(/^data:image\/png;base64,/, "");

     var imageBuffer = decodeBase64Image(fields.croppedImage[0]);
     console.log(imageBuffer);



     require("fs").writeFile("wheredoesthisgo.jpg", imageBuffer.data, 'base64', function(err) {
       console.log(err);
     });

     //here you can read the appropriate fields/files

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
