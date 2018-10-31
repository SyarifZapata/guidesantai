const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('./connection');
const model = require('./model');
const passport = require('passport');
// require('dotenv').config();

connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

connection.sync();


// const sendError = (err,res) => {
//   response.status = 501;
//   response.message = typeof err == 'object' ? err.message : err;
//   res.status(501).json(response);
// };
//
// //response handling
// let response = {
//   status: 200,
//   data: [],
//   message: null
// };

function validUser(user){
  const validEmail = typeof user.email === 'string' &&
                      user.email.trim() !== '';
  const validPassword = typeof user.password === 'string' &&
                      user.password.trim() !== '';
  // console.log(user);
  return validEmail && validPassword;
}

router.post('/auth/register', (req,res,next) => {
  if (validUser(req.body)){
    model.User.findOne({ where: {email: req.body.email}}).then(user => {
      console.log('user', user);
      // if user not found
      if(!user){
        // this is a unique email
        bcrypt.hash(req.body.password, 10)
          .then((hash) => {
          model.User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
          })
        });
      }else{
        // email in use
        next(new Error('Email in use'));
      }

    })
  } else {
    next(new Error('invalid user'))
  }
});

router.post('/auth/login', (req,res,next) => {
  passport.authenticate('local', (err,user,info) => {
    if(err) {return next(new Error('something went wrong when login'))}
    if(!user) {return next(new Error('Invalid login'))}
    if(user){
      console.log('until here');
      req.logIn(user,(err) =>{
        if(err) {console.log(err.message)}
        return res.json({
          message: 'logged in'
        })
      })
    }
  })(req,res,next);
});

// router.post('/auth/login', (req,res,next) => {
//   if(validUser(req.body)){
//     // do login
//     model.User.findOne({
//       where: {
//         email: req.body.email
//       }
//     }).then((user) => {
//       if(user){
//         bcrypt.compare(req.body.password, user.dataValues.password).then((result)=> {
//           if(result){
//             //password correct
//
//             res.json({
//               message: 'logged in!'
//             });
//           }else {
//             next(new Error('Invalid email or password!'));
//           }
//
//         });
//       }else{
//         next(new Error('wrong email'))
//       }
//     });
//   } else {
//     next(new Error('Invalid Login'));
//   }
// });


module.exports = router;
