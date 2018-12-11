const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FacebookUser = require('../models/facebookUser');


router.post('/finduser', isValidUser, (req,res,next) => {
  let name = req.body.username;
  let data = [];
  FacebookUser.findAll({attributes: ['facebook_id','username'], where:{username: name}}).then((fbusers) => {
    data = data.concat(fbusers);
    console.log(data);
    User.findAll({attributes: ['user_id','username'],where:{username: name}}).then((users) => {
      data = data.concat(users);
      console.log(data);
      res.status(200).json({data:data})
    });
  });

});

function isValidUser(req,res,next){
  if(req.isAuthenticated()) {next();}
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}


module.exports = router;
