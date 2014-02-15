/*global $, console */

// participant variables
var subjectID;
var condition;
var demographics = [];

// experimental variables 
var currTrial = 0;
var currTrial = 0;
var currBlock = 0;

var maxTrainTrial = 5;
var maxTestTrial = 5;
var maxBlock = 2;

var trainTrialStimuli = [130, -130, -20, 50, -10, -20, 70, 170, 120, 100, -120, 10, -30, 160, 140];
var testTrialStimuli = [160, -150, 120, -50, -150, 130, -80, -10, -40, 170, -120, 20, 20, -50, -170];

// CONDITION 
// experimental conditions
var colourCondition;

// canvas variables
var context;
var canvas;

// response variable
var response;

// timing variables
var base_time, rt;

// SLIDER
// slider variables
var default_slider_value = 50;

// 
function start () {
    // initialize canvas drawing
    initializeCanvas();

    // initialize the slider
    initializeSlider(100);
    
    
    hideElements();
    
    // generate a subject ID by generating a random number between 1 and 1000000
    subjectID = Math.round(Math.random() * 1000000);
    
    if (false) {
        // allow user to select where to start the experiment
        showInputOptions();
    } else {
        // randomize experimental conditions
        initializeCondition();
        showIntro();
    }
};

function initializeCondition () {
    var r = Math.ceil(Math.random() * 2); // generate random number
    if (r === 1) {
        colourCondition = 'red';
    } else if (r === 2) {
        colourCondition = 'blue';
    }
};
    

// draw experimental stimuli using canvas functions
function drawLine(degrees, colour, width, height) {
    var radians = degrees * (Math.PI / 180);
    var length = 200;

    // set width of line
    context.lineWidth = 5;

    // set line colour
    context.strokeStyle = colour;

    // draw line
    context.beginPath();
    context.moveTo(width / 2 - length * Math.cos(radians), height / 2 - length * Math.sin(radians));
    context.lineTo(width / 2 + length * Math.cos(radians), height / 2 + length * Math.sin(radians));
    context.closePath();
    context.stroke();
}

function saveTestTrial() {
    rt = new Date().getTime() - base_time;

    // all of the data from this trial will go into this object
    var exp_data = {};

    // add demographics data to trial output
    for (var i = 0; i < demographics.length; i++) {
        exp_data[demographics[i].name] = demographics[i].value;
    }
    exp_data.age = parseInt(exp_data.age, 10);

    // add trial data to trial output
    exp_data.subjectID = subjectID;
    exp_data.testTrial = currTestTrial;
    exp_data.block     = currBlock;
    exp_data.condition = condition;
    exp_data.rt = rt;
    exp_data.experiment = "test_experiment_v1";
    exp_data.button_value = response;
    // SLIDER
    exp_data.slider_value = $('#slider').slider('value');

    console.log(exp_data);

    // save trial data
    saveData(exp_data);

    // determine which section to go to next
    if(currTrial < maxTestTrial) {
        testTrial(); // next test trial
    }
    else {
        // increment block 
        currBlock++;

        if(currBlock < maxBlock) {
            currTrial = 0; // reset trial counter
            trainTrial(); // next training block
        }
        else {
            finishExperiment(); // end of experiment
        }
    }
}

function testTrial() {
    hideElements();

    // draw test stimuli
    $('#imageSpace').show();
    var currAngle = testTrialStimuli[5 * currBlock + currTrial];
    drawLine(currAngle, 'black', $('#imageSpace').width(), $('#imageSpace').height());

    // increment test trial counter
    currTrial++;

    // get time of beginning of trial
    base_time = new Date().getTime();

    // reset response variables
    response = -1;
    // SLIDER
    $('#slider').slider('value', default_slider_value);

    // response button example
    if (currBlock < 1) {
        // display test trial instructions
        $('#instructions').show();
        $('#instructions').load('html/instruction-test-button.html');

        // CONDITION 
        // change text value of response buttons depending on colour condition
        if (colourCondition === "red") {
            $('#blue').prop('value', 'Red');
        } else if (colourCondition === "blue") {
            $('#blue').prop('value', 'Blue');
        }

        // show response buttons
        $('#buttons').show();
        $('#blue').show();
        $('#green').show();

        $('#blue').click(function () {response = 0; saveTestTrial();});
        $('#green').click(function () {response = 1; saveTestTrial();});
    }
    // SLIDER
    // slider example
    else {
        $('#instructions').show();
        $('#instructions').load('html/instruction-test-slider.html');

        $("#sliderStuff").show();
        $("#slider-info").html($('#slider').slider('value') + "%"); // update slider value

        $('#buttons').show();
        $('#next').show();
        $('#next').click(saveTestTrial);
    }
}

function trainTrial() {
    hideElements();

    // display training trial instructions
    $('#instructions').show();
    $('#instructions').load('html/instruction-train.html');

    // draw training stimuli in canvas
    $('#imageSpace').show();
    var currAngle = trainTrialStimuli[5*currBlock + currTrial];

    // formula to figure out which colour line to display
    if(currAngle > 0 && currAngle < 90 || currAngle > -180 && currAngle < -90)
        drawLine(currAngle, colourCondition, $('#imageSpace').width(), $('#imageSpace').height());
    else
        drawLine(currAngle, 'green', $('#imageSpace').width(), $('#imageSpace').height());
    
    // increment training trial counter
    currTrial++;

    $('#buttons').show();
    $('#next').show();
    if(currTrial < maxTrainTrial)
        $('#next').click(trainTrial); // go to next training trial
    else
        currTrial = 0; // reset trial counter
        $('#next').click(testTrial); // proceed to test trial
}

