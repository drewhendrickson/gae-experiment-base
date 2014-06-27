/*global $, console, initializeCanvas, initializeSlider, hideElements, showInputOptions, showIntro, saveData */

// participant variables
var subjectID;
var condition;
var demographics = [];

// experimental variables 
var currTrial = 0;
var currBlock = 0;

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

// references to divs in the html
var divImageSpace, divSlider, divInstructions, divBlue, divGreen, divSliderStuff, divSliderInfo, divNext;


/* Variables you likely will need to change are below */

var trainTrialStimuli = [130, -130, -20, 50, -10, -20, 70, 170, 120, 100, -120, 10, -30, 160, 140];
var testTrialStimuli = [160, -150, 120, -50, -150, 130, -80, -10, -40, 170, -120, 20, 20, -50, -170];

// CONDITION 
// experimental conditions
var colourCondition;


// begin the experiment, initialize canvas, slider, subjectID, 
function start () {
  // initialize references to elements in html
  initDivReferences();

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
}

function initDivReferences () {
  divImageSpace = $('#imageSpace');
  divInstructions = $('#instructions');

  divBlue = $('#blue');
  divGreen = $('#green');
  divNext = $('#next');

  divSliderStuff = $('#sliderStuff');
  divSlider = $('#slider');
  divSliderInfo = $('#slider-info');
}

function initializeCondition () {
  var r = Math.ceil(Math.random() * 2); // generate random number
  if (r === 1) {
    colourCondition = 'red';
  } else if (r === 2) {
    colourCondition = 'blue';
  }
}


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

  // fix type of age if it exists (from demographics)
  if ("age" in exp_data)
    exp_data.age = parseInt(exp_data.age, 10);

  // add trial data to trial output
  exp_data.subjectID      = subjectID;
  exp_data.testTrial      = currTrial;
  exp_data.block          = currBlock;
  exp_data.condition      = condition;
  exp_data.rt             = rt;
  exp_data.experiment     = "test_experiment_v1";
  exp_data.button_value   = response;
  // SLIDER
  exp_data.slider_value = divSlider.slider('value');

  // print the data to console for debugging
  console.log(exp_data);

  // save trial data
  saveData(exp_data);

  selectNextTrial();
}

function selectNextTrial () {
  // how many test trials to do per block
  var maxTestTrial = 5;

  // how many blocks to do total
  var maxBlock = 2;

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
  var currAngle = testTrialStimuli[5 * currBlock + currTrial];
  drawLine(currAngle, 'black', divImageSpace.width(), divImageSpace.height());
  divImageSpace.show();

  // increment test trial counter
  currTrial++;

  // get time of beginning of trial
  base_time = new Date().getTime();

  // reset response variables
  response = -1;
  // SLIDER
  divSlider.slider('value', default_slider_value);

  // response button example
  if (currBlock < 1) {
    // display test trial instructions
    divInstructions.html('What colour should this line be?');
    divInstructions.show();

    // CONDITION 
    // change text value of response buttons depending on colour condition
    if (colourCondition === "red") {
      divBlue.prop('value', 'Red');
    } else if (colourCondition === "blue") {
      divBlue.prop('value', 'Blue');
    }

    // show response buttons
    divBlue.show();
    divGreen.show();

    divBlue.click(function () {response = 0; saveTestTrial();});
    divGreen.click(function () {response = 1; saveTestTrial();});
  }
  // SLIDER
  // slider example
  else {
    divInstructions.html('What is the probability this line is green?');
    divInstructions.show();

    divSliderInfo.html(divSlider.slider('value') + "%"); // update slider value
    divSliderStuff.show();

    divNext.show();
    divNext.click(saveTestTrial);
  }
}

function trainTrial() {
  hideElements();

  // how many training trials to do in each block
  var maxTrainTrial = 5;

  // display training trial instructions
  divInstructions.html('Here are some lines.');
  divInstructions.show();

  // draw training stimuli in canvas
  divImageSpace.show();

  // if the line has a positive slope, draw it green
  // otherwise draw it with the color of the condition
  var currAngle = trainTrialStimuli[5*currBlock + currTrial];
  var colour = 'green';
  if(currAngle > 0 && currAngle < 90 || currAngle > -180 && currAngle < -90)
    colour = colourCondition;
  drawLine(currAngle, colour, divImageSpace.width(), divImageSpace.height());

  // increment training trial counter
  currTrial++;

  divNext.show();
  if(currTrial < maxTrainTrial) {
    divNext.click(trainTrial); // go to next training trial
  }
  else {
    currTrial = 0; // reset trial counter
    divNext.click(testTrial); // proceed to test trial
  }
}

function finishExperiment() {
  hideElements();

  divInstructions.html('You have completed the experiment! If you are doing the experiment from Mechanical Turk, please enter the code 92nF72zm0 to complete the HIT.');
  divInstructions.show();
}
