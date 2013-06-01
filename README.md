gae-experiment-base
==================

Base experiment code for web experiments hosted on Google App Engine For Python (2.7)

### Requres:

- Python 2.7
- Google AppEngineLauncher for Python: [here](https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python)
- Google App command line tools (for downloading data from server). This must be done when starting Google AppEngineLauncher


### How does the code work?

Different sections of the experiment call each other in sequence. Currently the order is:  
1. collect demographics information  
2. provide instructions  
3. test instruction comprehension  
4. for each block within the experiment:  
        - display training trials  
        - display test trials  
5. display thank you message and feedback for MTurk users  

### How to run locally for testing (in Chrome)?

1. Open Google AppEngineLauncher
2. File -> Add Existing Application
3. Navigate to this folder
4. Click Add
5. Click Run in AppEngineLauncher
6. navigate in browser to localhost:8080

### Known issues:



### How to download data:

enter this at the command line:  

```
appcfg.py download_data --config_file=bulkloader.yaml --filename=<app_name>.csv --kind=DataObject --url=http://<app_name>.appspot.com/_ah/remote_api
```

### Notes for modifying this code
- all locations in experiment.js where the slider is referenced are marked with a comment SLIDER comment.
- all locations in experiment.js where between-subject conditions are referenced are marked with CONDITION comment.

#### If you change the data being written:

1. you'll have to re-create the download data file (bulkloader.yaml)

```
appcfg.py create_bulkloader_config --filename=bulkloader.yaml --url=http://<app_name>.appspot.com/_ah/remote_api
```

Then set the line in the new bulkloader.yaml `connector:` to `connector: csv`
 