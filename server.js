const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');
const socket = require('socket.io');

// dotenv allows you to use process.env.<sth> from the .env file
require('dotenv').config();
require('./server/crypto-config');
require('./server/redis-config');

//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// dist folder is where all the built app located
app.use(express.static(path.join(__dirname, 'dist')));

/* cookieParser is actually no longer needed in this current express but we
   let it here until we are sure everything works fine.
 */
app.use(cookieParser());

/* Dont forget to uncomment the 'store' key for production
   Please install the module, see npm.
 */
app.use(session({
  name: 'alice.sid',
  secret: process.env.COOKIE_SECRET,
  //store: new SequelizeStore({
  //    db: sequelize
  // })
  resave: false,
  saveUninitialized: false, // only save if loggin is successfully done.
  cookie: {
    maxAge: 24 * 60 * 60000,
    httpOnly: false,
    secure: false
  }
}));

/* Don't mess up with the order of the 'app.use's
   see the documentation to find out the correct order if you experience any errors
 */
require('./server/passport-config');
app.use(passport.initialize());
app.use(passport.session());


/* Please declare all routes here */
const auth = require('./server/routes/auth').authRouter;
const cryptoKeys = require('./server/routes/crypto-keys');
const chat = require('./server/routes/chat');
app.use('/auth/', auth);
app.use('/crypto-keys/',cryptoKeys);
app.use('/chat/',chat);



/* send all request to index html in dist folder */
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

const port = process.env.PORT || '3000';
app.set('port',port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));

const io = socket(server);
require('./server/socket-io/chat').chatSocket(io);

