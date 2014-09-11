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
  * after subjects have selected their response, the function saveTestTrial is called
  */
  
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
  base_time = new Date().getTime();

  // reset response variables
  response = -1;

  if (currBlock < 1) {
    // show a trial in which subjects respond by pressing one of two buttons

    // display test trial instructions
    divInstructions.html('What colour should this line be?');
    divInstructions.show();

    // show response buttons
    buttonA.show();
    buttonB.show();

    buttonA.click(function () {response = 0; saveTestTrial();});
    buttonB.click(function () {response = 1; saveTestTrial();});
  }
  else {
    // show a trial in which subjects respond by moving a slider
    divInstructions.html('What is the probability this line is green?');
    divInstructions.show();
    
    divSlider.slider('value', default_slider_value);

    divSliderInfo.html(divSlider.slider('value') + "%"); // update slider value
    divSliderStuff.show();

    buttonNext.show();
    buttonNext.click(saveTestTrial);
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