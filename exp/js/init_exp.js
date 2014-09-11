/*global $, document, window, console, alert, start */

// this function runs automatically when the page is loaded
$(document).ready(function () {

  // show an alert if user tries to navigate away from this page
  window.onbeforeunload = function() {
      return "Are you sure you want to leave this page?";
  };

  // load all scrips then begin the experiment
  $.when(
//        $.getScript( "http://code.jquery.com/ui/jquery-ui-git.js" ), // needed for the slider
    $.getScript( "js/offline_testing_tools/jquery-ui-git.js" ), // needed for the slider


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
