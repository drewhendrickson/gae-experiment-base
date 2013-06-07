gae-experiment-base
==================

Base experiment code for web experiments hosted on Google App Engine For Python (2.7)

### Requres:

- Python 2.7
- Google AppEngineLauncher for Python: [here](https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python)
- Google App command line tools (for downloading data from server). This must be done when starting Google AppEngineLauncher


### How does the experiment code work?

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
6. Navigate in browser to localhost:8080
7. Generate some data
7. To inspect the data you created, in the App Engine Launcher click on SDK Console and then on Datastore Viewer

### How to upload your experiment to the google server

1. Go to https://appengine.google.com/ and click Create Application
2. Application Identifier - only you use it but you need to know it for later
3. Application Title - this will appear as the label on the tab in the web browser of your experiment
4. Edit the first line of app.yaml to match your Application Identifier
5. In Google App Engine, click on Deploy and then enter the necessary credentials

### How to upload a new version of your experiment

1. change whatever you needed to change in the experiment
2. Edit app.yaml to have a new version number (usually by adding one)
3. In Google App Engine, click Deploy
4. click Dashboard
5. On the dashboard, click Versions (under Main in the left bar)
6. Set your new version as Default

### How to check on the data once deployed to the web

1. Open the dashboard for your experiment (via Google App Engine)
2. Click Datastore Viewer (under Data in the left bar)
3. Enjoy

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
 