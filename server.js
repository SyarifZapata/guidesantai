const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');
const socket = require('socket.io');
const cors = require('cors');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


// const opts = { key: fs.readFileSync('/home/arkad/server_key.pem')
//   , cert: fs.readFileSync('/home/arkad/server_cert.pem')
//   , requestCert: true
//   , rejectUnauthorized: false
//   , ca: [ fs.readFileSync('/home/arkad/server_cert.pem') ]
// };

app.use(cors({
  // origin:['https://localhost:3003', 'https://127.0.0.1:3003'],
  origin: true,
  credentials:true
}));


// dotenv allows you to use process.env.<sth> from the .env file
require('dotenv').config();
require('./server/crypto-config');
require('./server/redis-config');

//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* cookieParser is actually no longer needed in this current express but we
   let it here until we are sure everything works fine.
 */
app.use(cookieParser());


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  storage: './session.postgres',
  define: {
    timestamps: true
  }
});

// function extendDefaultFields(defaults, session) {
//   return {
//     data: defaults.data,
//     expires: defaults.expires,
//     user_id: session.user_id
//   }
// }


/* Dont forget to uncomment the 'store' key for production
   Please install the module, see npm.
 */
app.use(session({
  name: 'alice.sid',
  secret: process.env.COOKIE_SECRET,
  store: new SequelizeStore({
     db: sequelize,
     checkExpirationInterval: 15*60*1000,
     expiration: 24*60*60*1000
  }),
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
const chat = require('./server/routes/chat');
const u2f = require('./server/routes/u2f');
app.use('/auth/', auth);
app.use('/chat/',chat);
app.use('/u2f/', u2f);


const port = process.env.PORT || '3000';
app.set('port',port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on ${process.env.PRODUCTION}:${port}`));

