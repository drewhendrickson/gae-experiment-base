/*global $ */
/*jshint multistr: true */

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
