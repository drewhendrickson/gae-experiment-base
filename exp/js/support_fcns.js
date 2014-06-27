/*global $, document, divImageSpace,  divSlider, divSliderInfo, divSliderStuff, default_slider_value:true, canvas:true, context:true */
/*jshint multistr: true */

function initializeCanvas() {
  /*
  * initialize the canvas and context variables
  */
  
  canvas = document.getElementById("drawing");
  canvas.width = divImageSpace.width();
  canvas.height = divImageSpace.height();
  context = canvas.getContext("2d");
}

function initializeSlider(max) {
  /*
  * initialize the slider and slider variables
  */

  // set the default slider value
  default_slider_value = Math.floor(max / 2);
  
  // initialize slider if one is being used
  divSlider.slider({
    min: 0,
    max: max,
    step: 1,
    value: default_slider_value,
    slide: function (event, ui) {
      divSliderInfo.html(ui.value + '%');
    }
  });
}

function imageClear() {
  /*
  * clear the html canvas
  */

  context.fillStyle = '#ffffff'; // work around for Chrome
  context.fillRect(0, 0, canvas.width, canvas.height); // fill in the canvas with white
  canvas.width = canvas.width; // clears the canvas 
}

function hideElements() {
  /*
  * hide all buttons, slider, and text
  * clear the canvas and hide it
  */
  
  hideButtons();
  hideCanvas();
  hideSlider();
  hideText();
}

function hideText() {
  /*
  * hide all text elements
  */

  $('.text').hide();
}

function hideButtons() {
  /*
  * hide all button elements
  * unbind them so any functions previously attached to them are no longer attached
  */

  // hides all buttons
  $(':button').hide();

  // unbinds all buttons
  $(':button').unbind();
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

function hideSlider() {
  /*
  * hide all slider elements
  */

  divSliderStuff.hide();
}

function saveData(data) {
  /*
  * write a new row to the database
  *
  * data: a dictionary composed of key, value pairs
  *       containing all the info to write to the database
  *
  * an anonymous function is used because it creates a
  * copy of all information in the data variable, 
  * thus if any other functions change the data object after this function executes
  * then the information written to the database does not change
  */

  (function (d) {
    $.post('submit',  {"content": JSON.stringify(d)});
  })(data);
}

