experiment-base.js
==================

Base experiment code for web experiments

### How does the code work?
Different sections of the experiment call each other in sequence. Currently the order is:  
1. collect demographics information  
2. provide instructions  
3. test instruction comprehension  
4. for each block within the experiment:  
    * display training trials  
    * display test trials  
5. display thank you message and feedback for MTurk users  
