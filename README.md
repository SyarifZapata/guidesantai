# GuideSantai

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.0.
Basic Structure for API guidesantai marketplace (NodeJS) and WebFrontend (AngularJS)

## Installation
1. First you need to run 'npm install'
2. install postgreSQL 
3. create a database and grant access to an owner
4. install redis database (only needed for the chat functionality) 
5. create .env file in the app root folder add following lines, for the facebook_appID you should go to facebook developer page and create an app.
6. If you get error message related to scjl please run the patch.js file. 

PORT = <br />
DB_NAME = <br />
DB_HOST = <br />
DB_USER = <br />
DB_PASS = <br />

COOKIE_SECRET = <br />
FACEBOOK_APP_ID = <br />
FACEBOOK_SECRET = <br />
EMAIL_PASSWORD = <br/>
PRODUCTION = localhost

5. open terminal run 'ng build --watch' to build the project and watch for changes
6. open another terminal run 'nodemon server' to run Backend server and watch for changes
7. open another terminal run 'nodemon angular-server'to run frontend server (angular) and watch for changes
8. If you find error with Sass run 'npm rebuild node-sass' or follow instruction given from the error message
9. If you get problem with bcrypt, try to uninstall 'npm uninstall --save bcrypt' and install it again


For further question please contact me at syarif.zapata@gmail.com

copyright www.guidesantai.com 
