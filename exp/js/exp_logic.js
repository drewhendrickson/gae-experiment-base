/*global $, console, initializeCanvas, initializeSlider, hideElements, showInputOptions, showIntro, saveData */

// variables that will store information about the subject and the experiment condition
var subjectID;
var condition;
var demographics = [];

// variables that will store the current trial number and current block number
var currTrial = 0;
var currBlock = 0;

// variables that will store references to the html canvas used to display stimuli
var context;
var canvas;

// variables that will store what response subjects select and response time information
var response, base_time, rt;

// the default value of the slider
var default_slider_value;

// references to divs in the html
var divImageSpace, divSlider, divInstructions, divBlue, divGreen, divSliderStuff, divSliderInfo, divNext;

/* Variables you likely will need to change are below */

// how many test trials to do per block
var maxTestTrial = 5;

// how many blocks to do total
var maxBlock = 2;

// set this to false if you want the user to determine which condition to start in
// set this to true if you want to randomize the condition
var randomizeConditions = false;

// experimental stimuli
// in this case, the angle of the line to draw (in degrees)
var trainTrialStimuli = [130, -130, -20, 50, -10, -20, 70, 170, 120, 100, -120, 10, -30, 160, 140];
var testTrialStimuli = [160, -150, 120, -50, -150, 130, -80, -10, -40, 170, -120, 20, 20, -50, -170];

function start () {
  /* 
  * start is the first function called (from init_exp.js) when all the files are loaded
  * this function initializes many things, such as:
  * a bunch of javascript objects, the canvas we will draw on, the slider, and the subject id
  *
  * if radomizeConditions is set to false the user can select which condition they will see
  * and which segment of the experiment they will start in
  * otherwise the condition is randomized and 
  * this function finishes by calling showIntro to begin the experiment
  */
  
  // initialize references to elements in html
  initDivReferences();

  // initialize html canvas object
  initializeCanvas();

  // initialize the slider
  initializeSlider(100);

  // generate a subject ID by generating a random number between 1 and 1000000
  subjectID = Math.round(Math.random() * 1000000);

  // if you set this to true, it allow user to select conditions and where to start
  if (randomizeConditions) {
    showInputOptions();
  } else {
    // randomize experimental conditions
    initializeCondition();
    showIntro();
  }
}

function initDivReferences () {
  /* 
  * initDivReferences makes a number of jQuery requests to get html elements
  * the results are stored in javascript variables to make accessing them much faster
  * it does not return any value when finished
  *
  * you might want to add new js variables here if you add new html elements
  * to your index.html file. Be sure you declare new ones as is done above for these variables
  */
  
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
  /* 
  * initializeCondition randomly determines which condition to run the current user
  * it does not return any value when finished
  *
  * if you have more than 2 conditions, you might want to add more functionality here
  */
  
  var r = Math.ceil(Math.random() * 2); // generate random number
  if (r === 1) {
    condition = 'red';
  } else if (r === 2) {
    condition = 'blue';
  }
}

function drawLine(degrees, colour, width, height) {
  /*
  * drawLine draws a line in the html canvas
  * it assumes the canvas is already initialized
  * this function does not return any value when finished
  * 
  * degrees: the angle of the line
  * colour: the color of the line
  * width: the width of the canvas to draw on
  * height: the height of hte canvas to draw on
  */
  
  // convert degrees to radians
  var radians = degrees * (Math.PI / 180);

  // the length of the line
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
  /*
  * saveTestTrial builds up an object (exp_data) containing all of the
  * data from the current trial to save to the database
  * 
  * all of the information to save to the database needs to be added to exp_data. 
  * exp_data is a javascript dictionary, which consists of [key, value] pairs
  * To add a new pair to exp_data, do:
  * exp_data.KEY = VALUE;
  * you can see multiple examples of how this is done below
  *
  * when exp_data is completely built, it is passed as a paramter to saveData
  * which actually writes the information to the database on Google App Engine
  * 
  * after writing the data, this function calls selectNextTrial to determine
  * what the next type of trial should be
  *
  * to see how to retrieve all data, please look at the documentation in README.md
  */
  
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
  exp_data.slider_value = divSlider.slider('value');

  // print the data to console for debugging
  console.log(exp_data);

  // save trial data
  saveData(exp_data);

  // determine what type of trial to run next
  selectNextTrial();
}

function selectNextTrial () {
  /*
  * selectNextTrial determines based on the currTrial and currBlock variables
  * what the next type of trial should be or if the experiment is done
  * 
  * the appropriate next function is called
  */
  
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
    if (condition === "red") {
      divBlue.prop('value', 'Red');
    } else if (condition === "blue") {
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
    colour = condition;
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
