/*global $, document, window, console, alert, start */

// this function runs automatically when the page is loaded
$(document).ready(function () {

  // show an alert if user tries to navigate away from this page
  window.onbeforeunload = function() {
      return "Are you sure you want to leave this page?";
  };

  // load all scrips then begin the experiment
  $.when(
    $.getScript( "/js/lib/jquery-ui.1.11.0.min.js" ), // needed for the slider
    // if you want your code to run faster over the internet,
    // you can use http://code.jquery.com/ui/1.11.0/jquery-ui.min.js instead

    $.getScript( "/js/exp_logic.js" ),
    $.getScript( "/js/instructions.js" ),
    $.getScript( "/js/demographics.js" ),
    $.getScript( "/js/trial_types.js" ),
    $.getScript( "/js/canvas_fcns.js" ),
    $.getScript( "/js/slider_fcns.js" ),

    $.Deferred(function( deferred ){
      $( deferred.resolve );
    })
  ).done(function(){
    start();
  });
});
