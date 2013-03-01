// participant variables
var subjectID;
var condition;
var demographics;
var instructionChecks;

// experimental variables 
var currTrainTrial = 0;
var currTestTrial = 0;
var currBlock = 0;

var maxTrainTrial = 5;
var maxTestTrial = 5;
var maxBlock = 3;

var trainTrialStimuli = [130, -130, -20, 50, -10, -20, 70, 170, 120, 100, -120, 10, -30, 160, 140];
var testTrialStimuli = [160, -150, 120, -50, -150, 130, -80, -10, -40, 170, -120, 20, 20, -50, -170];

// experimental conditions
var colourCondition;

// canvas cariables
var width = 800;
var height = 400;
var context;
var canvas;

// this function runs automatically when the page is loaded
$(document).ready(function() {
    // initialize canvas drawing
    initializeCanvas();
    
    hideElements();

    // generate a subject ID by generating a random number between 1 and 1000000
    subjectID = Math.round(Math.random()*1000000);

    // randomize experimental conditions
    r = Math.ceil(Math.random()*2); // generate random number
    if(r == 1) {
	colourCondition = 'red';
    }
    else if(r == 2) {
	colourCondition = 'blue';
    }

    // first present the input options for the experiment (for debugging purposes)
    // allows you to set the experimental conditions instead of randomly assigning them above
    showInputOptions();
});

// experiment functions
function showInputOptions() {
    $('#input-options').show();
    $('#input-options').load('html/input-options.html');
    
    $('#next').show();
    $('#next').click(function() {
	// process input options here
	colourCondition = $('#colour').val();

	showDemographics(); 
    });
}

function showDemographics() {
    hideElements();
    
    // modify here if you want to get different demographic information
    // DEFAULT: subjectID, age, gender, country
    $('#demographics').show();
    $('#demographics').load('html/demographics.html');

    $('#next').show();
    $('#next').click(validateDemographics)    
}

function validateDemographics() {
    demographics = $('form').serializeArray();

    var ok = true;
    for(var i = 0; i < demographics.length; i++) {
	// test to only include alphanumeric characters
	if(/[^a-zA-Z0-9]/.test(demographics[i].value)) {
	    alert('Please only use alphanumeric characters.');
	    ok = false;
	    break;
	}

    // validate age
	if ((demographics[i].name == "age") & (/[^0-9]/.test(demographics[i].value))) {
	    alert('Please only use numbers in age.');
	    ok = false;
	    break;
	}

	// test for empty answers
	if(demographics[i].value == "") {
	    alert('Please fill out all fields.');
	    ok = false;
	    break;
	}
    }
    
    
    if(!ok) {
        showDemographics();
    }
    else {
	// remove demographics form
        $('#demographics').html('');
        showInstructions();
    }
}

// displays experiment instructions
function showInstructions() {
    hideElements();

    $('#instructions').show();
    if(colourCondition == 'red') {
	$('#instructions').load('html/instructions-red.html');
    }
    else if(colourCondition == 'blue') {
	$('#instructions').load('html/instructions-blue.html');
    }

    $('#next').show();
    $('#next').click(showInstructionChecks);
}

function showInstructionChecks() {
    hideElements();

    $('#instructions').show();
    $('#instructions').text('Here are some questions to check if you have read the instructions correctly. If you answer all the questions correct you will begin the experiment, otherwise you will be redirected to the instructions page again.');

    // TODO: left align radio buttons
    $('#instruction-checks').show();
    $('#instruction-checks').load('html/instruction-checks.html');
    
    $('#next').show();
    $('#next').click(validateInstructionChecks);
}

function validateInstructionChecks() {
    $('#next').unbind();
    
    instructionChecks = $('form').serializeArray();

    var ok = true;
    for(var i = 0; i < instructionChecks.length; i++) {
        // check for incorrect responses
        if(instructionChecks[i]["value"] != "correct") {
            ok = false;
        }
    }

    if(!ok) {
        showInstructions(); // go back to instruction screen
    }
    else {
        trainTrial(); // start experiment
    }
}

function trainTrial() {
    hideElements();

    // display training trial instructions
    // TODO: Move to separate html file
    $('#instructions').show();
    $('#instructions').text('Here are some lines.');

    // draw training stimuli in canvas
    $('#drawing').show();
    var currAngle = trainTrialStimuli[5*currBlock + currTrainTrial];

    // formula to figure out which colour line to display
    if(currAngle > 0 && currAngle < 90 || currAngle > -180 && currAngle < -90)
	drawLine(currAngle, colourCondition);
    else
	drawLine(currAngle, 'green');
    
    // increment training trial counter
    currTrainTrial++;

    $('#next').show();
    if(currTrainTrial < maxTrainTrial)
	$('#next').click(trainTrial) // go to next training trial
    else
	$('#next').click(testTrial) // proceed to test trial
}

function testTrial() {
    hideElements();

    // draw test stimuli
    $('#drawing').show();
    var currAngle = testTrialStimuli[5*currBlock + currTestTrial];
    drawLine(currAngle, 'black');

    // increment test trial counter
    currTestTrial++;

    // response button examples
    if(currBlock < 1) {
	// display test trial instructions
	// TODO: Move to separate html file
	$('#instructions').show();
	$('#instructions').text('What colour should this line be?');

	// show response buttons
	$('#blue').show();
	$('#green').show();

	// TODO: register which button was clicked
	$('#blue').click(saveTestTrial);
	$('#green').click(saveTestTrial);
    }
    // slider example
    else {
	// TODO: Move instructions to separate html file
	$('#instructions').show();
	$('#instructions').text('What is the probability this line is green?');

	$('#slider').slider({
	    min: 0, 
	    max: 100, 
	    step: 1, 
	    value: 50,
	    slide: function(event, ui) {
		$("#slider-info").html(ui.value + '%');
	}
    }); 

	$("#slider-info").html($('#slider').slider('value') + "%"); // updates slider value
	$('#slider-info').show();
	$('#slider').show();

	$('#next').show();
	$('#next').click(saveTestTrial);
    }
}

function saveTestTrial() {
    // TODO: distinguish between slider/button responses, normally won't be necessary in an experiment with only either the slider/response button though
    var exp_data = [{"subjectID": subjectID // TODO: save rest of participant/experiment variables here
		    }];

    // save trial data
    saveData([exp_data]);
    
    // determine which section to go to next
    if(currTestTrial < maxTestTrial) {
	testTrial(); // next test trial
    }
    else {
	// increment block 
	currBlock++;

	if(currBlock < maxBlock) {
            currTrainTrial = 0; // reset trial counters
            currTestTrial = 0;
            trainTrial(); // next training block
	}
	else {
            finishExperiment(); // end of experiment
	}
    }
}

// save experiment data with ajax
function saveData(args) {
    var data = args;

    // TODO: fill in details here, i.e. database table information (replace "experiment" with your own database table name in the data section)
    $.ajax({
	type: 'post',
	cache: false,
	url: 'submit_data_mysql.php',
	data: {"table": "experiment", "json": JSON.stringify(data)},
	success: function(data) { console.log(data); }
    });
}

function finishExperiment() {
    hideElements();

    $('#instructions').show();
    $('#instructions').text('You have completed the experiment! If you are doing the experiment from Mechanical Turk, please enter the code 92nF72zm0 to complete the HIT.');
}


// canvas functions
function initializeCanvas() {
    canvas = document.getElementById("drawing");
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext("2d");
}

// clears the whole canvas area
function imageClear() {
    context.fillStyle = '#ffffff'; // work around for Chrome
    context.fillRect(0, 0, canvas.width, canvas.height); // fill in the canvas with white
    canvas.width = canvas.width; // clears the canvas 
}

// hides all DOM elements from the screen and clears the canvas
function hideElements() {
    imageClear();
    
    // hides the canvas drawing
    $('#drawing').hide();

    // hides all divs
    $('div').hide();

    // hides all buttons
    $(':button').hide();
    
    // unbinds all buttons
    $(':button').unbind();
}

// draw experimental stimuli using canvas functions
function drawLine(degrees, colour) {
    var radians = degrees * (Math.PI/180)
    var length = 200;

    // set width of line
    context.lineWidth = 5;
    
    // set line colour
    context.strokeStyle = colour;

    // draw line
    context.beginPath();
    context.moveTo(width/2 - length*Math.cos(radians), height/2 - length*Math.sin(radians));
    context.lineTo(width/2 + length*Math.cos(radians), height/2 + length*Math.sin(radians));
    context.closePath();
    context.stroke();
}
