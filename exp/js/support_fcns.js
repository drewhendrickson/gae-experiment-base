/*global $, document, console, alert */

// canvas functions
function initializeCanvas() {
    canvas = document.getElementById("drawing");
    canvas.width = divImageSpace.width();
    canvas.height = divImageSpace.height();
    context = canvas.getContext("2d");
}

function initializeSlider(max) {
    // initialize slider if one is being used
    divSlider.slider({
        min: 0,
        max: 100,
        step: 1,
        value: default_slider_value,
        slide: function (event, ui) {
            divSliderInfo.html(ui.value + '%');
        }
    });
};

// clears the whole canvas area
function imageClear() {
    context.fillStyle = '#ffffff'; // work around for Chrome
    context.fillRect(0, 0, canvas.width, canvas.height); // fill in the canvas with white
    canvas.width = canvas.width; // clears the canvas 
}

// hides all DOM elements from the screen and clears the canvas
function hideElements() {
    hideButtons();
    hideCanvas();
    hideSlider();
    hideText();
}

function hideText() {
    // hides all text divs
    $('.text').hide();
}

function hideButtons() {
    // hides all buttons
    $(':button').hide();

    // unbinds all buttons
    $(':button').unbind();
}

function hideCanvas() {
    imageClear();

    // hides the canvas drawing
    divImageSpace.hide();
}

function hideSlider() {
    divSliderStuff.hide();
}

function showInputOptions() {
    // first present the input options for the experiment (for debugging purposes)
    // allows you to set the experimental conditions instead of randomly assigning them above
    var divInputOptions = $('#input-options');
    divInputOptions.show();
    divInputOptions.html('<h3>Experiment options</h3> \
                          <p>Stimuli Colour</p> \
													<select id="colour"> \
														<option value="red">Red</option> \
  													<option value="blue">Blue</option> \
 												 	</select> \
                          <p>What section should we start in?</p> \
                          <select id="section"> \
                            <option value="intro">Introduction</option> \
                            <option value="demographics">Demographics</option> \
                            <option value="instructions">Instructions</option> \
                            <option value="training">Training</option> \
                            <option value="testing">Testing</option> \
                          </select>');

    divButtons.show();
    divNext.show();
    divNext.click(function () {
        // CONDITION
        // process color option here
        colourCondition = $('#colour').val();
        
        // which section to start with:
        switch ($('#section').val()) {
            case "intro":
                showIntro();
                break;
            case "demographics":
                showDemographics();
                break;
            case "instructions":
                showInstructions();
                break;
            case "training":
                trainTrial();
                break;
            case "testing":
                testTrial();
                break;
        }
    });
    
}

function showIntro() {
    hideElements();

    divInstructions.show();
    divInstructions.html('<p>This is part of a study being run at the University of Adelaide. By clicking "Next" below you consent to take part in it.</p><p>Details of the study: The principal investigator is Prof Me (my.email.address). For any questions regarding the ethics of the study, please contact CONTACT INFO. Please direct any questions about this study to Prof Me. Although any data gained from this study may be published, you will not be identified and your personal details will not be divulged, nor will anything be linked to your Amazon ID. We use your Amazon ID merely to ensure you successfully completed the experiment and are paid. You may withdraw at any time, although you will not be paid unless you complete the study.</p>');

    divButtons.show();
    divNext.show();
    divNext.click(showDemographics);
}

function showDemographics() {
    hideElements();

    // modify here if you want to get different demographic information
    // DEFAULT: subjectID, age, gender, country
    var divDemographics = $('#demographics');
    divDemographics.show();
    divDemographics.load('html/demographics.html');

    divButtons.show();
    divNext.show();
    divNext.click(validateDemographics);
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
        if(demographics[i].value === "") {
            alert('Please fill out all fields.');
            ok = false;
            break;
        }
        
        if(demographics[i].name === "gender") {
            gender_exists = true;
        }
    }
    
    if ((gender_exists === false) && ok){
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

    divInstructions.show();
    
    // CONDITION 
    if(colourCondition == 'red') {
    divInstructions.load('html/instructions-red.html');
    }
    else if(colourCondition == 'blue') {
    divInstructions.load('html/instructions-blue.html');
    }

    divButtons.show();
    divNext.show();
    divNext.click(showInstructionChecks);
}

function showInstructionChecks() {
    hideElements();

    divInstructions.show();
    divInstructions.text('Here are some questions to check if you have read the instructions correctly. If you answer all the questions correctly you will begin the experiment, otherwise you will be redirected to the instructions page again.');

    var divInstructionChecks = $('#instruction-checks');
    divInstructionChecks.show();
    divInstructionChecks.load('html/instruction-checks.html');
    
    divButtons.show();
    divNext.show();
    divNext.click(validateInstructionChecks);
}

function validateInstructionChecks() {
    hideElements();
    
    $('form').show();
    var instructionChecks = $('form').serializeArray();

    var ok = true;
    for(var i = 0; i < instructionChecks.length; i++) {
        // check for incorrect responses
        if(instructionChecks[i].value != "correct") {
            ok = false;
            break;
        }

        // check for empty answers
        if(instructionChecks[i].value === "") {
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
        alert("You didn't answer all the questions correctly. Please read through the instructions and take the quiz again to continue.");
        showInstructions(); // go back to instruction screen
    }
    else {
        // remove instruction checks form
        $('#instruction-checks').html('');
        trainTrial(); // start experiment
    }
}

// save experiment data with ajax
function saveData(args) {
    (function (d) {
        $.post('submit',  {"content": JSON.stringify(d)});
    })(args);
}

function finishExperiment() {
    hideElements();

    divInstructions.show();
    divInstructions.load('html/instruction-finish.html');
}

