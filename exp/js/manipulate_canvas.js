
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