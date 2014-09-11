/*global $, document, divImageSpace */

// variables that will store references to the html canvas used to display stimuli
// these are global to increase speed of javascript
var context, canvas;

function drawLine(degrees, colour, width, height) {
  /*
  * drawLine draws a line in the html canvas
  * it assumes the canvas is already initialized
  * this function does not return any value when finished
  * 
  * degrees: the angle of the line
  * colour: the color of the line
  * width: the width of the canvas to draw on
  * height: the height of hte canvas to draw on
  */
  
  // convert degrees to radians
  var radians = degrees * (Math.PI / 180);

  // the length of the line
  var length = 200;

  // set width of line
  context.lineWidth = 5;

  // set line colour
  context.strokeStyle = colour;

  // draw line
  context.beginPath();
  context.moveTo(width / 2 - length * Math.cos(radians), height / 2 - length * Math.sin(radians));
  context.lineTo(width / 2 + length * Math.cos(radians), height / 2 + length * Math.sin(radians));
  context.closePath();
  context.stroke();
}

function initializeCanvas() {
  /*
  * initialize the canvas and context variables
  */
  
  canvas = document.getElementById("drawing");
  canvas.width = divImageSpace.width();
  canvas.height = divImageSpace.height();
  context = canvas.getContext("2d");
}

function imageClear() {
  /*
  * clear the html canvas
  */

  context.fillStyle = '#ffffff'; // work around for Chrome
  context.fillRect(0, 0, canvas.width, canvas.height); // fill in the canvas with white
  canvas.width = canvas.width; // clears the canvas 
}


function hideCanvas() {
  /*
  * clear the canvas and then hide it
  */

  // clear the canvas
  imageClear();

  // hides the canvas drawing
  divImageSpace.hide();
}

