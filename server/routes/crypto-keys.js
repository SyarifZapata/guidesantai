const express = require('express');
const router = express.Router();
const cryptoKey = require('../crypto-config');
const ChatFriend = require('../models/chatFriend');

router.get('/getKeys', (req,res,next) =>{
  res.status(200).json({
    prime: cryptoKey.getPrime,
    generator: cryptoKey.getGenerator
  })
});

// router.post('/store-secret', isValidUser, (req,res,next) =>{
//   let myId;
//   if(req.user.dataValues){
//     myId = req.user.dataValues.user_id;
//   }else {
//     myId = req.user.user_id;
//   }
//
//   ChatFriend.findOne({raw:true, where:{}})
// });

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

module.exports = router;
