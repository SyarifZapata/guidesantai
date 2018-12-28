const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../connection');
const User = require('../models/user');
const FacebookUser = require('../models/facebookUser');
require('../models/pendingRequest');
require('../models/chatFriend');
require('../models/conversation');
require('../models/u2fKeys');
const passport = require('passport');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const redis = require('redis');
const nodemailer = require('nodemailer');
require('dotenv').config({path:'../../.env'});
const async = require('async');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let client = Object;

/* Test the connection, you should see this message
   when you are able to establish connection with the database
 */
connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

/* This line is needed to create all the tables defined in models folder
   all changes in the model wont be synchronized after the table is created.
 */
connection.sync();

/* check if the username and the password has the correct type and not empty */
function validUser(user){
  const validUsername = typeof user.username === 'string' &&
    user.username.trim() !== '';
  const validEmail = typeof user.email === 'string' &&
    user.email.trim() !== '';
  const validPassword = typeof user.password === 'string' &&
    user.password.trim() !== '';
  return validEmail && validPassword && validUsername;
}


router.get('/clientcertificate', isValidUser, (req,res,next)=> {
  console.log('enter client certificate');
  const cert = req.connection.getPeerCertificate();
  res.send({message:`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`})
});

/*  Register a new user
    TODO: check if username is used.
 */
router.post('/register', (req,res,next) => {
  if (validUser(req.body)){
    let getUserByUsername = User.findOne({where:{username: req.body.username}});
    let getUserByEmail = User.findOne({where:{email: req.body.email}});

    getUserByUsername.then((result) => {
      if(result !== null) throw 'Die Benutzername wurde bereits verwendet';
      return getUserByEmail
    }).then((result) => {
      if(result !== null) throw 'Diese E-mail wurde bereits registriert';
      bcrypt.hash(req.body.password, 10)
        .then((hash) => {
          User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
          })
        });
      res.status(200).json({message:'Neuer Benutzer wurde erfolgreich registriert'})
    }).catch((err) =>{
      res.status(401).json({message:err})
    });
  } else {
    res.status(401).json({message:'Bitte das Formular korrekt ausfuellen'});
  }
});

router.post('/login', (req,res,next) => {
  passport.authenticate('local', (err,user,info) => {
    if(err) {return next(new Error('something went wrong when login'))}
    if(!user) {
      res.status(401).json({message:'Die E-Mail, der Benutzername oder das Passwort ist falsch'});
    }
    if(user){
      req.logIn(user,(err) =>{
        if(err) {
          console.log(err.message);
        }

        return res.status(200).json({
          message: 'Erfolgreich eingeloggt'
        })
      })
    }
  })(req,res,next);
});

router.get('/logout',isValidUser, (req,res,next) => {
  req.logout();
  return res.status(200).json({message: 'Erfolgreich ausgeloggt'})
});

/*  This route check if the user is logged in
    when he/she tries to access the member-only page
 */
router.get('/user', isValidUser, (req, res, next) => {
  // console.log(req.user.username);
  let data = {};
  // console.log(req);

  if(req.user.dataValues){
    client.hget(req.user.dataValues.username, "twoFaLoggedin", (err, value) =>{
      data = {
        message: 'Sie sind eingeloggt',
        user_id : req.user.dataValues.user_id,
        username:req.user.dataValues.username,
        picture:req.user.dataValues.picture,
        twoFAEnabled: req.user.dataValues.twoFAEnabled,
        twoFALoggedIn: value
      };
      return res.status(200).json(data)
    });

  }else {
    client.hget(req.user.username, "twoFaLoggedin", (err, value) =>{
      data = {
        message: 'Sie sind eingeloggt',
        user_id : req.user.user_id,
        username: req.user.username,
        picture: 'assets/img/profil/unknown_profile.png',
        twoFAEnabled: req.user.twoFAEnabled,
        twoFALoggedIn: value
      };
      return res.status(200).json(data)
    });

  }

});

/* this might cause problem */
let secret;

router.get('/getCode', (req,res,next) => {
  let token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });
  res.json({message:token})
});


router.post('/generateSecret', isValidUser, (req,res,next) => {
  secret = speakeasy.generateSecret({length:20});
  let userid = -1;

  if(req.user.dataValues){

    userid = req.user.dataValues.user_id;
    FacebookUser.update({twoFASecret:secret.base32},{where:{user_id:userid}}).then((rows_updated) => {
      console.log(rows_updated)
    }).catch((error) => {
      console.log(error)
    })
  }else {
    userid = req.user.user_id;
    User.update({twoFASecret:secret.base32},{where:{user_id:userid}}).then((rows_updated) => {
      console.log(rows_updated)
    }).catch((error) => {
      console.log(error)
    })
  }

  QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
    // console.log(image_data);
    if(image_data){
      res.status(200).json({qrcode:image_data})
    }
  });
});

router.post('/saveSettings', isValidUser, (req,res,next) => {
  const twoFa = req.body.twoFa;
  let userid = -1;
  if(req.user.dataValues){
    userid = req.user.dataValues.user_id;
    FacebookUser.update({twoFAEnabled:twoFa},{where:{user_id:userid}}).then((rows_updated) => {
      console.log(rows_updated)
    }).catch((error) => {
      console.log(error)
    })
  }else {
    userid = req.user.user_id;
    User.update({twoFAEnabled:twoFa},{where:{user_id:userid}}).then((rows_updated) => {
      console.log(rows_updated)
    }).catch((error) => {
      console.log(error)
    })
  }
  res.status(200).json({message:'nice'})
});

router.post('/compareToken', isValidUser, (req,res,next)=> {
  console.log('compare Token');

  let token = req.body.token;
  let secret;
  if(req.user.dataValues){
    secret = req.user.dataValues.twoFASecret;
  }else {
    secret = req.user.twoFASecret;
  }
  let verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token:token
  });
  console.log(verified);
  if(verified){
    let username;
    if(req.user.dataValues){
      username = req.user.dataValues.username;
    }else {
      username = req.user.username;
    }
    client.hset(username, "twoFaLoggedin", "true", redis.print);
    res.status(200).json({verified: verified})
  }else{
    res.status(401).json({verified: !verified})
  }

});

/*  This function will be passed to /user and /logout routes
    It is built in function provided by passport js
 */
function isValidUser(req,res,next){
  if(req.isAuthenticated()) {
    console.log('enter client certificate');
    const cert = req.connection.getPeerCertificate();
    if (req.client.authorized) {
      next();
    } else if (cert.subject) {
      res.status(403)
        .send({message:`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`})
    } else {
      res.status(401)
        .send({message:'Sorry, but you need to provide a client certificate to continue.'})
    }
  }
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}

/* Auth with facebook */
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook'), (req,res,next) =>{
  let user = req.user.dataValues;
  client.hget(user.username, "twoFaLoggedin", (err, value) => {
    if(user.twoFAEnabled && value !== true){
      res.redirect('https://localhost:3000/twofa');
    }else {
      res.redirect('https://localhost:3000/user');
    }
  });

});




router.post('/forgot-password', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ raw:true, where:{email: req.body.email}}).then((user)=>{
        if (!user) {
          return res.send({url:'/forgot', message: 'error, No account with that email address exists.'});
        }
        User.update({resettoken: token, resettokenexpires: Date.now() + 3600000} , {where:{email: req.body.email}}).then((result) => {
          console.log(result);
          done(null,token,user)
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'syarif.zapata@gmail.com',
          pass: process.env.EMAIL_PASSWORD
        }
      });
      var mailOptions = {
        to: req.body.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/auth/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.send({url:'/forgot'});
  });
});

router.get('/reset/:token', (req,res,next)=> {
  let token = req.params.token;
  User.findOne({raw: true, where: {resettoken: token, resettokenexpires: { [Op.gt]: Date.now() }}}).then((user) => {
    if (!user) {
      return res.send({url:'/forgot', message: 'error, password reset token is invalid or has expired.'});
    }
    res.redirect(`https://localhost:3000/reset/${token}`);
  });
});

router.post('/reset/:token', (req, res, next) => {
  let token = req.params.token;
  async.waterfall([
    function(done) {
      User.findOne({raw: true, where: {resettoken: token, resettokenexpires: { [Op.gt]: Date.now() }}}).then((user) => {
        if (!user) {
          return res.send({url:'/forgot', message: 'error, password reset token is invalid or has expired.'});
        }
        bcrypt.hash(req.body.password, 10)
          .then((hash) => {
            User.update({password:hash, resettoken: '', resettokenexpires: Date.now()} , {where:{user_id: user.user_id}}).then((result) => {
              done(null,user);
            });
          });

      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'syarif.zapata@gmail.com',
          pass: process.env.EMAIL_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err);
      });
    }
  ], function(err) {
    res.send({url:'/'});
  });
});


module.exports = {
  setClient : function (inClient) {
    client = inClient;
  },
  authRouter:router
};
