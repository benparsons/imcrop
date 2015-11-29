var ctxImage, canvasImage, imageObj, ratio;

window.onload = function() {

  canvasImage = document.getElementById('image');
  ctxImage = canvasImage.getContext('2d');
  imageObj = new Image();
  imageObj.src = "dragon.jpg";

  imageObj.onload = function () {
    drawImageScaled(imageObj, ctxImage);
  }

  canvasImage.onmousemove = function(event) {
    ctxImage.globalAlpha = 1;
    drawImageScaled(imageObj, ctxImage);
    var x = Math.floor(event.offsetX / ratio);
    var y = Math.floor(event.offsetY / ratio);
    ctxImage.globalAlpha=0.4;
    //ctxImage.fillRect(x*ratio,0,(x+200)*ratio,imageObj.height);
    ctxImage.fillRect(0,0,x*ratio,imageObj.height);
    var newWidth = 1080 * imageObj.height / 1920;
    ctxImage.fillRect((x+newWidth)*ratio,0,imageObj.width,imageObj.height);
  }

  canvasImage.onclick = function(event) {
    console.log(event.offsetX);
    console.log(Math.floor(event.offsetX / ratio));
  }
}

function drawImageScaled(img, ctx) {
 var canvas = ctx.canvas ;
 var hRatio = canvas.clientWidth  / img.width    ;
 var vRatio =  canvas.clientHeight / img.height  ;
 ratio  = Math.min ( hRatio, vRatio );
 ctx.drawImage(img, 0,0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio);

}
