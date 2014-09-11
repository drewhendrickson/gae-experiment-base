/*global divSlider, divSliderInfo, divSliderStuff, default_slider_value:true */

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

function hideSlider() {
  /*
  * hide all slider elements
  */

  divSliderStuff.hide();
}
