/*global htmlElements, experimentInfo:true */

function initializeSlider(max) {
  /*
  * initialize the slider and slider variables
  */

  // set the default slider value
  experimentInfo.default_slider_value = Math.floor(max / 2);
  
  // initialize slider if one is being used
  htmlElements.divSlider.slider({
    min: 0,
    max: max,
    step: 1,
    value: experimentInfo.default_slider_value,
    slide: function (event, ui) {
      htmlElements.divSliderInfo.html(ui.value + '%');
    }
  });
}

function hideSlider() {
  /*
  * hide all slider elements
  */

  htmlElements.divSliderStuff.hide();
}
