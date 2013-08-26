// participant variables
var subjectID;
var condition;
var demographics = [];
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

// CONDITION 
// experimental conditions
var colourCondition;

// canvas cariables
var width = 800;
var height = 400;
var context;
var canvas;

// response variable
var response;

// timing variables
var base_time, rt;

// SLIDER
// slider variables
var default_slider_value = 50;

var skipToTest = true;

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

// draw experimental stimuli using canvas functions
function drawLine(degrees, colour) {
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

function saveTestTrial() {
    rt = new Date().getTime() - base_time;
    console.log(rt);

    var exp_data = {};

    // add demographics data to trial output
    for (var i = 0; i < demographics.length; i++) {
        exp_data[demographics[i].name] = demographics[i].value;
    }
    exp_data["age"] = parseInt(exp_data["age"]);

    // add trial data to trial output
    exp_data["subjectID"] = subjectID;
    exp_data["testTrial"] = currTestTrial;
    exp_data["block"]     = currBlock;
    exp_data["condition"] = condition;
    exp_data["rt"] = rt;
    exp_data["experiment"] = "test_experiment_v1";
    exp_data["button_value"] = response;
    // SLIDER
    exp_data["slider_value"] = $('#slider').slider('value');

    console.log(exp_data);

    // save trial data
    saveData([[exp_data]]);

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

function testTrial() {
    hideElements();

    // draw test stimuli
    $('#drawing').show();
    var currAngle = testTrialStimuli[5 * currBlock + currTestTrial];
    drawLine(currAngle, 'black');

    // increment test trial counter
    currTestTrial++;

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
        $('#blue').show();
        $('#green').show();

        $('#blue').click(function () {response = 0; saveTestTrial()});
        $('#green').click(function () {response = 1; saveTestTrial()});
    }
    // SLIDER
    // slider example
    else {
        $('#instructions').show();
        $('#instructions').load('html/instruction-test-slider.html');

        $("#slider-info").html($('#slider').slider('value') + "%"); // update slider value
        $('#slider-info').show();
        $('#slider').show();

        $('#next').show();
        $('#next').click(saveTestTrial);
    }
}

// this function runs automatically when the page is loaded
$(document).ready(function () {
    // initialize canvas drawing
    initializeCanvas();

    // SLIDER
    // initialize slider if one is being used
    $('#slider').slider({
        min: 0,
        max: 100,
        step: 1,
        value: default_slider_value,
        slide: function (ui) {
            $("#slider-info").html(ui.value + '%');
        }
    });

    hideElements();

    // generate a subject ID by generating a random number between 1 and 1000000
    subjectID = Math.round(Math.random() * 1000000);

    // CONDITION 
    // randomize experimental conditions
    var r = Math.ceil(Math.random() * 2); // generate random number
    if (r === 1) {
        colourCondition = 'red';
    } else if (r === 2) {
        colourCondition = 'blue';
    }

    // CONDITION
    // first present the input options for the experiment (for debugging purposes)
    // allows you to set the experimental conditions instead of randomly assigning them above
    if (skipToTest) {
        testTrial();
    } else {
        showInputOptions();
    }
})

// experiment functions
function showInputOptions() {
    $('#input-options').show();
    $('#input-options').load('html/input-options.html');

    $('#next').show();
    $('#next').click(function () {
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
    $('#next').click(validateDemographics);
}

function validateDemographics() {
    demographics = $('form').serializeArray();

    var ok = true, gender_exists = false;
    for (var i = 0; i < demographics.length; i++) {
        // validate age
        if ((demographics[i].name == "age") & (/[^0-9]/.test(demographics[i].value))) {
            alert('Please only use numbers in age.');
            ok = false;
            break;
        }
        else {
            // test to only include alphanumeric characters
            if ((demographics[i].name != "country") & (/[^a-zA-Z0-9]/.test(demographics[i].value))) {
                alert('Please only use alphanumeric characters.');
                ok = false;
                break;
            }
        }

        // test for empty answers
        if(demographics[i].value == "") {
            alert('Please fill out all fields.');
            ok = false;
            break;
        }
        
        if(demographics[i].name == "gender") {
            gender_exists = true;
        }
    }
    
    if ((gender_exists == false) && ok){
        alert('Please select a gender.');
        ok = false;
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
    
    // CONDITION 
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

    $('#instruction-checks').show();
    $('#instruction-checks').load('html/instruction-checks.html');
    
    $('#next').show();
    $('#next').click(validateInstructionChecks);
}

function validateInstructionChecks() {
    hideElements();
    
    $('form').show();
    instructionChecks = $('form').serializeArray();

    var ok = true;
    for(var i = 0; i < instructionChecks.length; i++) {
        // check for incorrect responses
        if(instructionChecks[i].value != "correct") {
            ok = false;
            break;
        }

        // check for empty answers
        if(instructionChecks[i].value == "") {
            alert('Please fill out all fields.');
            ok = false;
            break;
        }
    }
    
    // where this is the number of questions in the instruction check
    if (instructionChecks.length != 3) {
        ok = false;
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
    $('#instructions').show();
    $('#instructions').load('html/instruction-train.html');

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



// save experiment data with ajax
function saveData(args) {
    var data = args;

    $.post('submit', data={"content": JSON.stringify(data)})
}

function finishExperiment() {
    hideElements();

    $('#instructions').show();
    $('#instructions').load('html/instruction-finish.html')
}


