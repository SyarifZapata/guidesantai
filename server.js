const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
require('dotenv').config();

//api file for interacting with MongoDb
const api = require('./server/routes/api');

//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'dist')));

//api location
app.use('/api/', api);

app.use((err,req,res,next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message
  })
});

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true
}));

//send all request to angular app
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

const port = process.env.PORT || '3000';
app.set('port',port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
