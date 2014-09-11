/*global $, divImageSpace, divSlider, divSliderInfo, divSliderStuff, default_slider_value:true, imageClear */
/*jshint multistr: true */

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
