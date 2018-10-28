const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('./connection');
const model = require('./model');

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
  if(validUser(req.body)){
    // do login
    model.User.findAll({
      limit: 1,
      where: {
        email: req.body.email
      }
    }).then((user) => {
      if(user){
        // console.log(user[0].dataValues.password)
        bcrypt.compare(req.body.password, user[0].dataValues.password).then((result)=> {
          if(result){
            //password correct
            res.json({
              result
            })
          }else {
            next(new Error('Invalid login'));
          }

        });
      }else{
        next(new Error('wrong email'))
      }
    });
  } else {
    next(new Error('Invalid Login'));
  }
});


module.exports = router;
