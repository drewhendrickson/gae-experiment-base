/*global $, document, console, alert */

// this function runs automatically when the page is loaded
$(document).ready(function () {
    
    // show an alert if user tries to navigate away from this page
    window.onbeforeunload = function() {
        return "Are you sure you want to leave this page?";
    };

    // load all scrips then begin the experiment
    $.when(
        $.getScript( "http://code.jquery.com/ui/jquery-ui-git.js" ),
        $.getScript( "http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/js/bootstrap.min.js" ),
        $.getScript( "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js" ),
        $.getScript( "/js/support_fcns.js" ),
        $.getScript( "/js/exp_logic.js" ),

        $.Deferred(function( deferred ){
            $( deferred.resolve );
        })
    ).done(function(){
        start();
    });
});
