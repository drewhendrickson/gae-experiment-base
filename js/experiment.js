// participant variables
var subjectID;
var condition;
var demographics;

// experimental variables 
var currTrainTrial = 0;
var currTestTrial = 0;
var currBlock = 0;

var maxTrainTrial = 5;
var maxTestTrial = 5;
var maxBlock = 3;

// canvas cariables
var width = 1000;
var height = 400;
var context;
var canvas;

// this function runs automatically when the page is loaded
$(document).ready(function() {
    // initialize canvas drawing
    canvas = document.getElementById("drawing");
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext("2d");
    
    // hide canvas drawing for now, otherwise it takes up space
    $('#drawing').hide();

    // generate a subject ID by generating a random number between 1 and 1000000
    subjectID = Math.round(Math.random()*1000000);

    // TODO: randomize experimental conditions
    
    // after initializating variables above, display the experiment instructions
    showDemographics();
})

function showDemographics() {
    $('#next').unbind();

	// modify here if you want to get different demographic information
	// DEFAULT: username, age, gender, country
    $('#demographics').html('<form><label for="user">Unique User ID:</label><input name="user" /><br>\
							<label for="age">Age:</label><input name="age" /><br>\
							<label for="gender">Gender:</label><input type="radio" name="gender" value="male" />Male <input type="radio" name="gender" value="female" />Female<br>\
							<label for="country">Country:</label><input name="country" /></form>');

	$('#next').click(validateDemographics)
    
}

function validateDemographics() {
    $('#next').unbind();

	demographics = $('form').serializeArray();

	var ok = true;
	for (var i = 0; i < demographics.length; i++) {
		// test to only include alphanumeric characters
		if( /[^a-zA-Z0-9]/.test( demographics[i]["value"] ) ) {
		       alert('Please only use alphanumeric characters.');
		       ok = false;
		    }
		// test for empty answers
		if (demographics[i]["value"] == "") {
	       alert('Please fill out all fields.');
	       ok = false;
		}
	}
	
	if (!ok) {
		showDemographics();
	}
	else {
		$('#demographics').hide();
		showInstructions();
	}
}

// experiment functions

// TODO: input options

// displays experiment instructions
function showInstructions() {
    $('#next').unbind();

    $('#instructions').text('Here are the experiment instructions.');

    $('#next').click(trainTrial)
}

// TODO: instruction checks

function trainTrial() {
    $('#next').unbind();

    // display training trial instructions
    $('#instructions').text('Here are some training stimuli.');

    // TODO: draw training stimuli in canvas
    $('#drawing').show();

    // increment training trial counter
    currTrainTrial++;

    if(currTrainTrial < maxTrainTrial)
	$('#next').click(trainTrial) // go to next training trial
    else
	$('#next').click(testTrial) // proceed to test trial
}

function testTrial() {
    $('#next').unbind();

    // display test trial instructions
    $('#instructions').text('What is this stimuli?');

    // TODO: draw test stimuli in canvas

    // TODO: response option

    // TODO: save experiment data

    // increment test trial counter
    currTestTrial++;
    
    // TODO: embed this inside the next click function?
    if(currTestTrial < maxTestTrial) {
	$('#next').click(testTrial);
    }
    else {
	// increment block 
	currBlock++;

	if(currBlock < maxBlock) {
	    currTrainTrial = 0;
	    currTestTrial = 0;
	    $('#next').click(trainTrial)
	}
	else {
	    finishExperiment();
	}
    }
}

function finishExperiment() {
    $('#drawing').hide(); // hide canvas element
    $('#next').hide(); // hide next button

    $('#instructions').text('You have completed the experiment!');
}

// save experiment data with ajax
function saveData(args) {
    var data = args;

	// TODO: add demographics info to data

    // TODO: fill in details here, i.e. database table information (replace "experiment" with your own database table name in the data section)
    $.ajax({
	type: 'post',
	cache: false,
	url: 'submit_data_mysql.php',
	data: {"table": "experiment", "json": JSON.stringify(data)},
	success: function(data) { console.log(data); }
    });
}

// canvas functions

// clears the whole canvas area
function imageClear() {
    context.fillStyle = '#ffffff'; // work around for Chrome
    context.fillRect(0, 0, canvas.width, canvas.height); // fill in the canvas with white
    canvas.width = canvas.width; // clears the canvas 
}
