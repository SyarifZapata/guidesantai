const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');

require('dotenv').config();



//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'dist')));



app.use((err,req,res,next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message
  })
});

app.use(cookieParser());
app.use(session({
  name: 'alice.sid',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false, // only save if loggin is successfully done.
  cookie: {
    maxAge: 24 * 60 * 60000,
    httpOnly: false,
    secure: false
  }
}));

require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());

//api location
const api = require('./server/routes/api');
app.use('/api/', api);

//send all request to angular app
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

const port = process.env.PORT || '3000';
app.set('port',port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
