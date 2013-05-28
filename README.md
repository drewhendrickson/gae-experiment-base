gae-experiment-base
==================

Base experiment code for web experiments hosted on Google App Engine For Python ()

### How does the code work?
Different sections of the experiment call each other in sequence. Currently the order is:  
1. collect demographics information  
2. provide instructions  
3. test instruction comprehension  
4. for each block within the experiment:  
    * display training trials  
    * display test trials  
5. display thank you message and feedback for MTurk users  

### How to run locally for testing (in Chrome)?

1. Open Google AppEngineLauncher
2. File -> Add Existing Application
3. Navigate to this folder
4. Click Add
5. Click Run in AppEngineLauncher
6. navigate in browser to localhost:8080

### Known issues:

1. writing to DB is completely broken

### Requres:

- Python 2.7
- Google AppEngineLauncher

### Notes for modifying this code
- all locations in experiment.js where the slider is referenced are marked with a comment SLIDER comment.
- all locations in experiment.js where between-subject conditions are referenced are marked with CONDITION comment.

