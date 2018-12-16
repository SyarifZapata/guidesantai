const u2f = require('u2f');
const express = require('express');
const router = express.Router();

// The app ID is a string used to uniquely identify your U2F app, for both registration requests and
// authentication requests. It is usually the fully qualified URL of your website. The website MUST
// be HTTPS, otherwise the registration will fail client-side.
const APP_ID = 'https://localhost:3000';

router.get('/u2fregistration', isValidUser, (req, res, next) => {
  console.log('we come hiere');
  const registrationRequest = u2f.request(APP_ID);
  req.session.registrationRequest = registrationRequest;
  res.send(registrationRequest);
});

router.post('/solution', isValidUser, (req,res,next)=>{
  console.log(req.body.registrationResponse);
  const result = u2f.checkRegistration(req.session.registrationRequest, req.body.registrationResponse);

  if (result.successful) {
    console.log('Success!!!');
    // Success!
    // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
    // this user.
    return res.sendStatus(200);
  }
});

function registrationVerificationHandler(req, res) {
  // 4. Verify the registration response from the client against the registration request saved
  // in the server-side session.
  const result = u2f.checkRegistration(req.session.registrationRequest, req.body.registrationResponse);

  if (result.successful) {
    // Success!
    // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
    // this user.
    return res.sendStatus(200);
  }

  // result.errorMessage is defined with an English-language description of the error.
  return res.send({result});
}

function isValidUser(req,res,next){
  if(req.isAuthenticated()) {next();}
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}

module.exports = router;
