/*global $, document, console, alert */
/*jshint multistr: true */

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
    divDemographics.html('<form> \
                            <label for="user">Subject ID:</label><input name="uniqueID" /><br /><br /> \
                            <label for="age">Age:</label><input name="age" /><br /><br /> \
                            <label for="gender">Gender:</label> \
                              <input type="radio" name="gender" value="male" /> Male &nbsp; \
                              <input type="radio" name="gender" value="female" /> Female<br /><br /> \
                            <label for="country">Country:</label> \
                            <select name="country" id="country" class="drop-menu"> \
                              <option>Afghanistan</option><option>&Aring;land Islands</option><option>Albania</option><option>Algeria</option><option>American Samoa</option><option>Andorra</option><option>Angola</option><option>Anguilla</option><option>Antarctica</option><option>Antigua and Barbuda</option><option>Argentina</option><option>Armenia</option><option>Aruba</option><option  selected="selected">Australia</option><option>Austria</option><option>Azerbaijan</option><option>Bahamas</option><option>Bahrain</option><option>Bangladesh</option><option>Barbados</option><option>Belarus</option><option>Belgium</option><option>Belize</option><option>Benin</option><option>Bermuda</option><option>Bhutan</option><option>Bolivia</option><option>Bosnia and Herzegovina</option><option>Botswana</option><option>Bouvet Island</option><option>Brazil</option><option>British Indian Ocean territory</option><option>Brunei Darussalam</option><option>Bulgaria</option><option>Burkina Faso</option><option>Burundi</option><option>Cambodia</option><option>Cameroon</option><option>Canada</option><option>Cape Verde</option><option>Cayman Islands</option><option>Central African Republic</option><option>Chad</option><option>Chile</option><option>China</option><option>Christmas Island</option><option>Cocos (Keeling) Islands</option><option>Colombia</option><option>Comoros</option><option>Congo</option><option>Congo, Democratic Republic</option><option>Cook Islands</option><option>Costa Rica</option><option>C&ocirc;te dIvoire (Ivory Coast)</option><option>Croatia (Hrvatska)</option><option>Cuba</option><option>Cyprus</option><option>Czech Republic</option><option>Denmark</option><option>Djibouti</option><option>Dominica</option><option>Dominican Republic</option><option>East Timor</option><option>Ecuador</option><option>Egypt</option><option>El Salvador</option><option>Equatorial Guinea</option><option>Eritrea</option><option>Estonia</option><option>Ethiopia</option><option>Falkland Islands</option><option>Faroe Islands</option><option>Fiji</option><option>Finland</option><option >France</option><option>French Guiana</option><option>French Polynesia</option><option>French Southern Territories</option><option>Gabon</option><option>Gambia</option><option>Georgia</option><option >Germany</option><option>Ghana</option><option>Gibraltar</option><option>Greece</option><option>Greenland</option><option>Grenada</option><option>Guadeloupe</option><option>Guam</option><option>Guatemala</option><option>Guinea</option><option>Guinea-Bissau</option><option>Guyana</option><option>Haiti</option><option>Heard and McDonald Islands</option><option>Honduras</option><option>Hong Kong</option><option>Hungary</option><option>Iceland</option><option>India</option><option>Indonesia</option><option>Iran</option><option>Iraq</option><option>Ireland</option><option>Israel</option><option>Italy</option><option>Jamaica</option><option>Japan</option><option>Jordan</option><option>Kazakhstan</option><option>Kenya</option><option>Kiribati</option><option>Korea (north)</option><option>Korea (south)</option><option>Kuwait</option><option>Kyrgyzstan</option><option>Lao Peoples Democratic Republic</option><option>Latvia</option><option>Lebanon</option><option>Lesotho</option><option>Liberia</option><option>Libyan Arab Jamahiriya</option><option>Liechtenstein</option><option>Lithuania</option><option>Luxembourg</option><option>Macao</option><option>Macedonia, Former Yugoslav Republic Of</option><option>Madagascar</option><option>Malawi</option><option>Malaysia</option><option>Maldives</option><option>Mali</option><option>Malta</option><option>Marshall Islands</option><option>Martinique</option><option>Mauritania</option><option>Mauritius</option><option>Mayotte</option><option>Mexico</option><option>Micronesia</option><option>Moldova</option><option>Monaco</option><option>Mongolia</option><option>Montenegro</option><option>Montserrat</option><option>Morocco</option><option>Mozambique</option><option>Myanmar</option><option>Namibia</option><option>Nauru</option><option>Nepal</option><option>Netherlands</option><option>Netherlands Antilles</option><option>New Caledonia</option><option >New Zealand</option><option>Nicaragua</option><option>Niger</option><option>Nigeria</option><option>Niue</option><option>Norfolk Island</option><option>Northern Mariana Islands</option><option>Norway</option><option>Oman</option><option>Pakistan</option><option>Palau</option><option>Palestinian Territories</option><option>Panama</option><option>Papua New Guinea</option><option>Paraguay</option><option>Peru</option><option>Philippines</option><option>Pitcairn</option><option>Poland</option><option>Portugal</option><option>Puerto Rico</option><option>Qatar</option><option>R&eacute;union</option><option>Romania</option><option>Russian Federation</option><option>Rwanda</option><option>Saint Helena</option><option>Saint Kitts and Nevis</option><option>Saint Lucia</option><option>Saint Pierre and Miquelon</option><option>Saint Vincent and the Grenadines</option><option>Samoa</option><option>San Marino</option><option>Sao Tome and Principe</option><option>Saudi Arabia</option><option>Senegal</option><option>Serbia</option><option>Seychelles</option><option>Sierra Leone</option><option>Singapore</option><option>Slovakia</option><option>Slovenia</option><option>Solomon Islands</option><option>Somalia</option><option>South Africa</option><option>South Georgia and the South Sandwich Islands</option><option>Spain</option><option>Sri Lanka</option><option>Sudan</option><option>Suriname</option><option>Svalbard and Jan Mayen Islands</option><option>Swaziland</option><option>Sweden</option><option>Switzerland</option><option>Syria</option><option>Taiwan</option><option>Tajikistan</option><option>Tanzania</option><option>Thailand</option><option>Togo</option><option>Tokelau</option><option>Tonga</option><option>Trinidad and Tobago</option><option>Tunisia</option><option>Turkey</option><option>Turkmenistan</option><option>Turks and Caicos Islands</option><option>Tuvalu</option><option>Uganda</option><option>Ukraine</option><option>United Arab Emirates</option><option >United Kingdom</option><option >United States of America</option><option>Uruguay</option><option>Uzbekistan</option><option>Vanuatu</option><option>Vatican City</option><option>Venezuela</option><option>Vietnam</option><option>Virgin Islands (British)</option><option>Virgin Islands (US)</option><option>Wallis and Futuna Islands</option><option>Western Sahara</option><option>Yemen</option><option>Zaire</option><option>Zambia</option><option>Zimbabwe</option></select></form>');

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
    
    divInstructions.html('In this task you will see ' + colourCondition + ' and green coloured lines. The colour of the lines depends on their orientation. Your task will be to learn to classify the colour of new lines based on the orientation of them. When you are ready, please press the Next button.');
    divInstructions.show();

    divButtons.show();
    divNext.show();
    divNext.click(showInstructionChecks);
}

function showInstructionChecks() {
    hideElements();

    divInstructions.show();
    divInstructions.text('Here are some questions to check if you have read the instructions correctly. If you answer all the questions correctly you will begin the experiment, otherwise you will be redirected to the instructions page again.');

    var divInstructionChecks = $('#instruction-checks');
    divInstructionChecks.html('<form> \
                                <label for="question1">Question 1:</label> \
                                <input type="radio" name="question1" value="correct" /> Correct <br /> \
                                <input type="radio" name="question1" value="incorrect" /> Incorrect<br /><br /> \
                                <label for="question2">Question 2:</label> \
                                <input type="radio" name="question2" value="correct" /> Correct <br /> \
                                <input type="radio" name="question2" value="incorrect" /> Incorrect<br /><br /> \
                                <label for="question3">Question 3:</label> \
                                <input type="radio" name="question3" value="correct" /> Correct <br /> \
                                <input type="radio" name="question3" value="incorrect" /> Incorrect<br /> \
                              </form>');
    divInstructionChecks.show();

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

    divInstructions.html('You have completed the experiment! If you are doing the experiment from Mechanical Turk, please enter the code 92nF72zm0 to complete the HIT.');
    divInstructions.show();
}

