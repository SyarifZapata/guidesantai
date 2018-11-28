const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../connection');
const User = require('../models/user');
const FacebookUser = require('../models/facebookUser');
const passport = require('passport');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

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
    data = {
      message: 'Sie sind eingeloggt',
      username:req.user.dataValues.username,
      picture:req.user.dataValues.picture
    }
  }else {
    data = {
      message: 'Sie sind eingeloggt',
      username: req.user.username,
      picture: 'assets/img/profil/unknown_profile.png'
    }
  }
  return res.status(200).json(data)
});

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

  // if(req.user.dataValues){
  //
  //   userid = req.user.dataValues.facebook_id;
  //   FacebookUser.update({twoFASecret:secret.base32},{where:{facebook_id:userid}}).then((rows_updated) => {
  //     console.log(rows_updated)
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }else {
  //   userid = req.user.user_id;
  // }

  QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
    // console.log(image_data);
    if(image_data){
      res.status(200).json({qrcode:image_data})
    }
  });
});

/*  This function will be passed to /user and /logout routes
    It is built in function provided by passport js
 */
function isValidUser(req,res,next){
  if(req.isAuthenticated()) {next();}
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}

/* Auth with facebook */
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook'), (req,res,next) =>{
  res.redirect('http://localhost:3000/user');
});



module.exports = router;
