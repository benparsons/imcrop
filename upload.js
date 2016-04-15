(function() {
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


  var upload = function () {};

  upload.prototype.local = function(req, callback) {

    var multiparty = require('multiparty');
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

      var imageBuffer = decodeBase64Image(fields.croppedImage[0]);
      console.log(imageBuffer);

      require("fs").writeFile("wheredoesthisgo.jpg", imageBuffer.data, 'base64', callback(err));

    });
  };

  module.exports = new upload();
}());
