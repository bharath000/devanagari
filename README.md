Creating a deployable model:

From the above results two different models named DVNG_M and dvng_m with accuracy 0.991 and 0.992 are converted into tesorflow.js and save them in two different folders named DVNG_M and dvng_m. The folders contains model.json file which contains the summary of the trained model. This file (model.json) is used for calling the model in Javascript file.

Node and Express:

	Create a REST server using Express-generator, install node modules in it.
	Create index.html file in Public folder where the model is going to be hosted.
	Create a script file named predict.js in public/javascripts folder where model.json file is extracted and used for predicting the give input Image.
	Include Tensorflow.js cdn into index.html and write a function in predict.js such that upon clicking the button the uploaded image will be pre-processed and gives the output of class name.
	Start the server locally and test the functioning of it, and also add UI that is required on the web-page
	However, the model takes time for loading and prediction.

Deploying the Rest server:
Heroku is a web hosting platform. Download the CLI of heroku. Login into your account in CLI. Upload the REST server created above.

Working model: https://morning-anchorage-56517.herokuapp.com
