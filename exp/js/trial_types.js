/*global $, console, hideElements, maxTestTrial, currBlock, currTrial:true, drawLine, selectNextTrial, divImageSpace, demographics, subjectID, condition, buttonA, buttonB, buttonNext, divSlider, default_slider_value, divSliderStuff, divSliderInfo, divInstructions, hideCanvas, hideSlider */

function testTrial() {
  /* 
  * display a test trial in which a black line is shown on the screen
  * and subjects are asked to respond to it
  *
  * which stimuli to display from testTrialStimuli is determined
  * by the current block (currentBlock) and current trial number (currTrial)
  *
  * in the first test block, participants respond by pressing one of two buttons
  * in the second test block, they respond by moving a slider to indicate belief
  *
  * all of the information to save to the database needs to be added to exp_data.
  * 
  * exp_data is a javascript dictionary, which consists of [key, value] pairs
  * To add a new pair to exp_data, do:
  * exp_data.KEY = VALUE;
  * you can see examples of how this is done below
  *
  * after subjects have selected their response, the function saveTestTrial is called
  */

  // the angle of the line to draw (in degrees) for testing
  var testTrialStimuli = [160, -150, 120, -50, -150, 130, -80, -10, -40, 170, -120, 20, 20, -50, -170];
  
  // remove all elements from the screen
  // reset all buttons so they do not have any functions bound to them
  hideElements();

  // draw test stimuli
  var currAngle = testTrialStimuli[maxTestTrial * currBlock + currTrial];
  drawLine(currAngle, 'black', divImageSpace.width(), divImageSpace.height());
  divImageSpace.show();

  // increment test trial counter
  currTrial++;

  // get time of beginning of trial
  var base_time = new Date().getTime();
  
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
  exp_data.experiment     = "test_experiment_v1";

  if (currBlock < 1) {
    // show a trial in which subjects respond by pressing one of two buttons

    // display test trial instructions
    divInstructions.html('What colour should this line be?');
    divInstructions.show();
    
    // set the type of this trial
    exp_data.responseType = "categorize";

    buttonA.click(function () {saveTestTrial(exp_data, 0, base_time);});
    buttonB.click(function () {saveTestTrial(exp_data, 1, base_time);});

    // show response buttons
    buttonA.show();
    buttonB.show();
  }
  else {
    // show a trial in which subjects respond by moving a slider
    divInstructions.html('What is the probability this line is green?');
    divInstructions.show();
    
    // set the type of this trial
    exp_data.responseType = "slider";

    // determine what to do when the next button is clicked
    buttonNext.click(function () {saveTestTrial(exp_data, divSlider.slider('value'), base_time);});

    // setup the slider
    divSlider.slider('value', default_slider_value);
    divSliderInfo.html(divSlider.slider('value') + "%"); // update slider value

    // show the slider and the next button
    divSliderStuff.show();
    buttonNext.show();
  }
}

function trainTrial() {
  /* 
  * display a training trial in which a colored line is shown on the screen
  * and subjects are asked to press next when done studying it
  *
  * which stimuli to display from trainingTrialStimuli is determined
  * by the current block (currentBlock) and current trial number (currTrial)
  *
  * after each Next click, checks if the correct number of training trials have been shown
  * if so, proceed to test trials
  * otherwise, show another training trial
  */

  // the angle of the line to draw (in degrees) for testing
  var trainTrialStimuli = [130, -130, -20, 50, -10, -20, 70, 170, 120, 100, -120, 10, -30, 160, 140];

  // how many training trials to do in each block
  var maxTrainTrial = 5;

  // remove all elements from the screen
  // reset all buttons so they do not have any functions bound to them
  hideElements();

  // display training trial instructions
  divInstructions.html('Here is a colored line. Study it and press Next when done.');
  divInstructions.show();

  // draw training stimuli in canvas
  divImageSpace.show();

  // if the line has a positive slope, draw it green
  // otherwise draw it with the color of the condition
  var currAngle = trainTrialStimuli[maxTrainTrial * currBlock + currTrial];
  var colour = 'green';
  if(currAngle > 0 && currAngle < 90 || currAngle > -180 && currAngle < -90)
    colour = condition;
  drawLine(currAngle, colour, divImageSpace.width(), divImageSpace.height());

  // increment training trial counter
  currTrial++;

  buttonNext.show();
  if(currTrial < maxTrainTrial) {
    buttonNext.click(trainTrial); // go to next training trial
  }
  else {
    currTrial = 0; // reset trial counter
    buttonNext.click(testTrial); // proceed to test trial
  }
}

function saveTestTrial(exp_data, response, base_time) {
  /*
  * saveTestTrial should be passed an object (exp_data) containing all of the
  * data from the current trial to save to the database
  * 
  * when exp_data is completely built, it is passed as a paramter to saveData
  * which actually writes the information to the database on Google App Engine
  * 
  * after writing the data, this function calls selectNextTrial to determine
  * what the next type of trial should be
  *
  * to see how to retrieve all data, please look at the documentation in README.md
  */
  
  // record the response time and include it in the object to write to file
  exp_data.rt = new Date().getTime() - base_time;

  // add the subject's response to the data object
  exp_data.response = response; 

  // print the data to console for debugging
  console.log(exp_data);

  // save trial data
  saveData(exp_data);

  // determine what type of trial to run next
  selectNextTrial();
}


function saveData(data) {
  /*
  * write a new row to the database
  *
  * data: a dictionary composed of key, value pairs
  *       containing all the info to write to the database
  *
  * an anonymous function is used because it creates a
  * copy of all information in the data variable, 
  * thus if any other functions change the data object after this function executes
  * then the information written to the database does not change
  */

  (function (d) {
    $.post('submit',  {"content": JSON.stringify(d)});
  })(data);
}

