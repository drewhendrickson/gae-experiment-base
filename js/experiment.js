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
    canvas = document.getElementById("drawing");
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext("2d");
    
    // hide canvas drawing for now, otherwise it takes up space
    $('#drawing').hide();

    // hide buttons
    $('#blue').hide();
    $('#green').hide();

    // generate a subject ID by generating a random number between 1 and 1000000
    subjectID = Math.round(Math.random()*1000000);

    // randomize experimental conditions
    // TODO: fix colour/buttons etc.
    r = Math.ceil(Math.random()*2); // generate random number
    if(r == 1) {
    colourCondition = 'red';
    }
    else if(r == 2) {
    colourCondition = 'blue';
    }

    // first present the input options for the experiment (for debugging purposes)
    // TODO: uncomment this when complete
    showInputOptions();

    // showDemographics();

    // showInstructions();
});

// experiment functions
function showInputOptions() {
    // TODO: move input options to a separate html file
    $('#inputoptions').html('<h3>Experiment options</h3><p>Stimuli Colour</p><select id="colour"><option value="red">Red</option><option value="blue">Blue</option></select>');
    
    $('#next').click(function() {
    // process input options here
    colourCondition = $('#colour').val();

	// showDemographics(); TODO: replace this 
	showInstructions();
    });
}

function showDemographics() {
    $('#inputoptions').hide();
    
    $('#next').unbind();

    // modify here if you want to get different demographic information
    // DEFAULT: username, age, gender, country
    $('#demographics').html('<form><label for="user">Unique User ID:</label><input name="user" /><br /><br />\
<label for="age">Age:</label><input name="age" /><br /><br />\
<label for="gender">Gender:</label><input type="radio" name="gender" value="male" /> Male &nbsp; <input type="radio" name="gender" value="female" /> Female<br /><br />\
<label for="country">Country:</label><input name="country" /></form>');

    $('#next').click(validateDemographics)    
}

function validateDemographics() {
    $('#next').unbind();

    demographics = $('form').serializeArray();
    console.log(demographics);
    

    var ok = true;
    for (var i = 0; i < demographics.length; i++) {
        // test to only include alphanumeric characters
        if( /[^a-zA-Z0-9]/.test( demographics[i]["value"] ) ) {
            alert('Please only use alphanumeric characters.');
            ok = false;
        }

        // TODO: validate age

        // test for empty answers
        if (demographics[i]["value"] == "") {
            alert('Please fill out all fields.'); // TODO: make alert only pop-up once
            ok = false;
        }
    }
    
    if (!ok) {
        showDemographics();
    }
    else {
        $('#demographics').hide();
        $('#demographics').html('');
        showInstructions();
    }
}

// displays experiment instructions
function showInstructions() {
    $('#inputoptions').hide();

    $('#next').unbind();

    $('#instructions').text('Here are the experiment instructions.');

    $('#next').click(showInstructionChecks);
}

function showInstructionChecks() {
    $('#next').unbind();
    
    $('#instructions').text('Here are some questions to check if you have read the instructions correctly. If you answer all the questions correct you will begin the experiment, otherwise you will be redirected to the instructions page again.');

    // TODO: put html inside separate page
    // TODO: left align radio buttons
    $('#instructionchecks').html('<form><label for="question1">Question 1:</label><input type="radio" name="question1" value="correct" /> Correct <br /><input type="radio" name="question1" value="incorrect" /> Incorrect<br /><br /><label for="question2">Question 2:</label><input type="radio" name="question2" value="correct" /> Correct <br /><input type="radio" name="question2" value="incorrect" /> Incorrect<br /><br /><label for="question3">Question 3:</label><input type="radio" name="question3" value="correct" /> Correct <br /><input type="radio" name="question3" value="incorrect" /> Incorrect</form>');

    $('#next').click(validateInstructionChecks);
}

function validateInstructionChecks() {
    $('#next').unbind();
    
    // TODO: fix validation
    instructionChecks = $('form').serializeArray();
    console.log(instructionChecks);

    var ok = true;
    for(var i = 0; i < instructionChecks.length; i++) {
        // check for incorrect responses
        if(instructionChecks[i]["value"] != "correct") {
            ok = false;
        }
    }

    if(!ok) {
        showInstructions();
    }
    else {
        trainTrial();
    }
}

function trainTrial() {
    imageClear();

    // unbind buttons
    $('#next').unbind();
    $('#blue').unbind();
    $('#green').unbind();

    // hide elements
    $('#instructionchecks').hide();
    $('#blue').hide();
    $('#green').hide();

    // show next button
    $('#next').show();

    // display training trial instructions
    $('#instructions').text('Here are some lines.');

    // draw training stimuli in canvas
    $('#drawing').show();
    var currAngle = trainTrialStimuli[5*currBlock + currTrainTrial];

    if(currAngle > 0 && currAngle < 90 || currAngle > -180 && currAngle < -90)
    drawLine(currAngle, colourCondition);
    else
    drawLine(currAngle, 'green');
    
    // increment training trial counter
    currTrainTrial++;

    if(currTrainTrial < maxTrainTrial)
    $('#next').click(trainTrial) // go to next training trial
    else
    $('#next').click(testTrial) // proceed to test trial
}

function testTrial() {
    imageClear();

    // unbind buttons, necessary to do so otherwise multiple calls will be made each time the button is clicked!
    $('#next').unbind();
    $('#blue').unbind();
    $('#green').unbind();

    // hide next button

    $('#next').hide();

    // show response buttons
    $('#blue').show();
    $('#green').show();

    // display test trial instructions
    $('#instructions').text('What colour should this line be?');

    // draw test stimuli
    var currAngle = testTrialStimuli[5*currBlock + currTestTrial];
    drawLine(currAngle, 'black');

    // increment test trial counter
    currTestTrial++;

    $('#blue').click(saveTestTrial);
    $('#green').click(saveTestTrial);
}

function saveTestTrial() {
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
    // hide canvas element
    $('#drawing').hide();

    // hide buttons
    $('#next').hide(); 
    $('#blue').hide();
    $('#green').hide();

    $('#instructions').text('You have completed the experiment! If you are doing the experiment from Mechanical Turk, please enter the code 92nF72zm0 to complete the HIT.');
}

// canvas functions

// clears the whole canvas area
function imageClear() {
    context.fillStyle = '#ffffff'; // work around for Chrome
    context.fillRect(0, 0, canvas.width, canvas.height); // fill in the canvas with white
    canvas.width = canvas.width; // clears the canvas 
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
