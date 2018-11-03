# AliceApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.0.

## Installation
1. First you need to run 'npm install'
2. install postgreSQL 
3. create a database and grant access to an owner
4. create .env in the app root folder add following lines, for the facebook_appID you should go to facebook developer page and create an app.

PORT = <br />
DB_NAME = <br />
DB_HOST = <br />
DB_USER = <br />
DB_PASS = <br />

COOKIE_SECRET = <br />
FACEBOOK_APP_ID = <br />
FACEBOOK_SECRET = <br />

5. open terminal run 'ng build --watch'
6. open another terminal run 'nodemon server'
7. If you find error with Sass run 'npm rebuild node-sass' or follow instruction given from the error message
8. If you get problem with bcrypt, try to uninstall 'npm uninstall --save bcrypt' and install it again




## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
