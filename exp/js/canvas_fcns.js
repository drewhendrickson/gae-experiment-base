/*global $, document, htmlElements, experimentInfo */

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
  experimentInfo.context.lineWidth = 5;

  // set line colour
  experimentInfo.context.strokeStyle = colour;

  // draw line
  experimentInfo.context.beginPath();
  experimentInfo.context.moveTo(width / 2 - length * Math.cos(radians), height / 2 - length * Math.sin(radians));
  experimentInfo.context.lineTo(width / 2 + length * Math.cos(radians), height / 2 + length * Math.sin(radians));
  experimentInfo.context.closePath();
  experimentInfo.context.stroke();
}

function initializeCanvas() {
  /*
  * initialize the canvas and context variables
  */
  
  // define the canvas and context objects in experimentInfo from the contents of the html canvas element
  experimentInfo.canvas = document.getElementById("drawing");
  experimentInfo.canvas.width = htmlElements.divImageSpace.width();
  experimentInfo.canvas.height = htmlElements.divImageSpace.height();
  experimentInfo.context = experimentInfo.canvas.getContext("2d");
}

function imageClear() {
  /*
  * clear the html canvas
  */

  experimentInfo.context.fillStyle = '#ffffff'; // work around for Chrome
  experimentInfo.context.fillRect(0, 0, experimentInfo.canvas.width, experimentInfo.canvas.height); // fill in the canvas with white
  experimentInfo.canvas.width = experimentInfo.canvas.width; // clears the canvas 
}


function hideCanvas() {
  /*
  * clear the canvas and then hide it
  */

  // clear the canvas
  imageClear();

  // hides the canvas drawing
  htmlElements.divImageSpace.hide();
}

