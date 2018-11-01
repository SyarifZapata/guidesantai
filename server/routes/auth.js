const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../connection');
const User = require('../models/user');
const passport = require('passport');

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
  const validEmail = typeof user.email === 'string' &&
                      user.email.trim() !== '';
  const validPassword = typeof user.password === 'string' &&
                      user.password.trim() !== '';
  return validEmail && validPassword;
}

/*  Register a new user
    TODO: check if username is used.
 */
router.post('/register', (req,res,next) => {
  if (validUser(req.body)){
    User.findOne({ where: {email: req.body.email}}).then(user => {
      console.log('user', user);
      // if user not found
      if(!user){
        // this is a unique email
        bcrypt.hash(req.body.password, 10)
          .then((hash) => {
          User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
          })
        });
      }else{
        // email in use
        res.status(401).json({message:'Diese E-mail ist bereits registriert'});
      }

    })
  } else {
    res.status(401).json({message:'Bitte das Formular korrekt ausfuellen'});
  }
});

router.post('/login', (req,res,next) => {
  passport.authenticate('local', (err,user,info) => {
    if(err) {return next(new Error('something went wrong when login'))}
    if(!user) {
      res.status(401).json({message:'Die Email oder das Passwort ist falsch'});
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
  return res.status(200).json({message: 'Sie sind eingeloggt'})
});

/*  This function will be passed to /user and /logout routes
    It is built in function provided by passport js
 */
function isValidUser(req,res,next){
  if(req.isAuthenticated()) {
    next();}
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}

// const getUserByUsername = User.User;

router.post('/transaction' , (req,res,next) => {

});


module.exports = router;
