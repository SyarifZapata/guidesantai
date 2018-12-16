const u2f = require('u2f');
const express = require('express');
const router = express.Router();
const U2fKey = require('../models/u2fKeys');

// The app ID is a string used to uniquely identify your U2F app, for both registration requests and
// authentication requests. It is usually the fully qualified URL of your website. The website MUST
// be HTTPS, otherwise the registration will fail client-side.
const APP_ID = 'https://localhost:3000';

router.get('/u2fregistration', isValidUser, (req, res, next) => {
  const registrationRequest = u2f.request(APP_ID);
  req.session.registrationRequest = registrationRequest;
  console.log('yuhuuuuu');
  console.log(registrationRequest);
  res.send(registrationRequest);
});

router.post('/solution', isValidUser, (req,res,next)=>{
  console.log(req.body.registrationResponse);
  const result = u2f.checkRegistration(req.session.registrationRequest, req.body.registrationResponse);

  let id;
  if(req.user.dataValues){
    id = req.user.dataValues.user_id;
  }else{
    id = req.user.user_id
  }

  if (result.successful) {
    // Success!
    // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
    // this user.
    U2fKey.findOne({raw:true, where:{user_id:id}}).then((key) => {
      if(key){
        console.log('find userid with key'+ key.public_key);
        return U2fKey.update({public_key:result.publicKey, key_handle:result.keyHandle, challenge:req.session.registrationRequest.challenge}, {where:{user_id:id}});
      }else {
        console.log('no user');
        return U2fKey.create({user_id:id, public_key:result.publicKey, key_handle:result.keyHandle, challenge:req.session.registrationRequest.challenge })
      }
    }).then((record) => {
      res.status(200).json({message:'key stored'})
    });
  }else{
    return res.send({result});
  }

});

router.get('/asku2f', isValidUser, (req,res,next) => {
  console.log('bis hiere');
  let id;
  if(req.user.dataValues){
    id = req.user.dataValues.user_id;
  }else{
    id = req.user.user_id
  }

  U2fKey.findOne({raw:true, where:{user_id:id}}).then((user) => {
    const keyHandle = user.key_handle;

    // 3. Generate an authentication request and save it in the session. Use the same app ID that
    // was used in registration!
    const authRequest = u2f.request(APP_ID, keyHandle);
    req.session.authRequest = authRequest;

    // 4. Send the authentication request to the client, who will use the Javascript U2F API to sign
    // the authentication request, and send it back to the server for verification.
    res.json({authRequest:authRequest, challenge: user.challenge})
  })
});

router.post('/validationu2f', isValidUser, (req,res,next)=>{
  console.log('Validierennnnnn');
  let id;
  if(req.user.dataValues){
    id = req.user.dataValues.user_id;
  }else{
    id = req.user.user_id
  }

  U2fKey.findOne({raw:true, where:{user_id:id}}).then((user) => {
    const publicKey = user.public_key;
    const result = u2f.checkSignature(req.session.authRequest, req.body.authResponse, publicKey);
    if (result.successful) {
      res.status(200).json({message:'user Authenticated'})
    }else{
      return res.send({result});
    }
  });

});


function isValidUser(req,res,next){
  if(req.isAuthenticated()) {next();}
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}

module.exports = router;
