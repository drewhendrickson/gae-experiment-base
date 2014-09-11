/*global $, console, initializeCanvas, initializeSlider, hideElements, showInputOptions, showIntro, trainTrial, testTrial, hideCanvas, hideSlider */

// variables that will store information about the subject and the experiment condition
var subjectID;
var condition;
var demographics = [];

// variables that will store the current trial number and current block number
var currTrial = 0;
var currBlock = 0;


// the default value of the slider
var default_slider_value;

// references to divs in the html
var divImageSpace, divSlider, divInstructions, buttonA, buttonB, buttonNext, divSliderStuff, divSliderInfo;

// how many test trials to do per block
var maxTestTrial = 5;

// set this to false if you want the user to determine which condition to start in
// set this to true if you want to randomize the condition
var randomizeConditions = false;

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

  // generate a subject ID by generating a random number between 1 and 1000000
  subjectID = Math.round(Math.random() * 1000000);

  // if you set this to true, it allow user to select conditions and where to start
  if (!randomizeConditions) {
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

  buttonA = $('#a');
  buttonB = $('#b');
  buttonNext = $('#next');

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
  
  // randomly assign condition
  var r = Math.ceil(Math.random() * 2); // generate random number
  if (r === 1) {
    condition = 'red';
  } else if (r === 2) {
    condition = 'blue';
  }
}

function initializeTask () {
  /* 
  * initializeTask does all the configuration before beginning training and testing
  * when done, start training by calling trainTrial
  */
  
  // initialize the slider
  initializeSlider(100);

  // change text value of response buttons depending on colour condition
  buttonB.prop('value', 'Green');
  buttonA.prop('value', 'Blue');
  if (condition === "red") {
    buttonA.prop('value', 'Red');
  }
  
  // start the training
  trainTrial();
}

function selectNextTrial () {
  /*
  * selectNextTrial determines based on the currTrial and currBlock variables
  * what the next type of trial should be or if the experiment is done
  * 
  * the appropriate function is called next
  */
  
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

function finishExperiment() {
  /* 
  * finishExperiment is called when all trials are complete and subjects are done
  * removes everything from the screen and thanks the subject
  */
  
  // remove all elements from the screen
  // reset all buttons so they do not have any functions bound to them
  hideElements();

  divInstructions.html('You have completed the experiment! If you are doing the experiment from Mechanical Turk, please enter the code 92nF72zm0 to complete the HIT.');
  divInstructions.show();
}

function hideElements() {
  /*
  * hide all buttons, slider, and text
  * clear the canvas and hide it
  */
  
  hideButtons();
  hideCanvas();
  hideSlider();
  hideText();
}

function hideText() {
  /*
  * hide all text elements
  */

  $('.text').hide();
}

function hideButtons() {
  /*
  * hide all button elements
  * unbind them so any functions previously attached to them are no longer attached
  */

  // hides all buttons
  $(':button').hide();

  // unbinds all buttons
  $(':button').unbind();
}
