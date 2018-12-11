const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FacebookUser = require('../models/facebookUser');
const PendingRequest = require('../models/pendingRequest');


router.post('/finduser', isValidUser, (req,res,next) => {
  let name = req.body.username;
  let yourId;
  if (req.user.dataValues){
    yourId = req.user.dataValues.facebook_id;
  }else{
    yourId = req.user.user_id;
  }
  let data = [];
  FacebookUser.findAll({attributes: ['facebook_id','username', 'picture'], where:{username: name}}).then((fbusers) => {
    data = data.concat(fbusers);
    console.log('Yipiiiii');
    User.findAll({attributes: ['user_id','username', 'picture'],where:{username: name}}).then((users) => {
      data = data.concat(users);
      let fb = fbusers.map(a => a.facebook_id);
      let normal = users.map(a => a.user_id);
      const result = fb.concat(normal);
      console.log(result);
      PendingRequest.findAll({where: {from_id:yourId, to_id: result }}).then((request) => {
        console.log(request);
        res.status(200).json({data:data, pending: request})
      });

    });
  });
});

router.post('/invitechat', isValidUser, (req,res,next) => {
  let to_id = req.body.to_id;
  let from_id;
  if(req.user.dataValues){
    from_id = req.user.dataValues.facebook_id;
  }else{
    from_id = req.user.user_id
  }
  PendingRequest.create({
    from_id: from_id,
    to_id: to_id
  }).then((result) => {
    res.status(200).json(result);
  })
});

router.post('/findpendingrequest', isValidUser, (req,res,next) => {
  let to_id = req.body.to_id;
  let from_id;
  if(req.user.dataValues){
    from_id = req.user.dataValues.facebook_id;
  }else{
    from_id = req.user.user_id
  }
  PendingRequest.create({
    from_id: from_id,
    to_id: to_id
  }).then((result) => {
    res.status(200).json(result);
  })
});

router.post('/cancelrequest', isValidUser, (req,res,next) => {
  const id = req.body.id;
  PendingRequest.destroy({where:{to_id:id}}).then((result) => {
    res.status(200).json(result);
  })
});

router.get('/needtoapprove', isValidUser, (req,res,next) => {
  let id;
  if(req.user.dataValues){
    id = req.user.dataValues.facebook_id;
  }else{
    id = req.user.user_id;
  }
  PendingRequest.findAll({where:{to_id:id}}).then((users) => {
    const result = users.map(a => a.from_id);
    let data = [];
    FacebookUser.findAll({attributes: ['facebook_id','username', 'picture'], where:{facebook_id:result}}).then((fbusers) => {
      data = data.concat(fbusers);

      User.findAll({attributes: ['user_id','username', 'picture'],where:{user_id:result}}).then((users) => {
        data = data.concat(users);
        res.status(200).json({data:data})
      });
    });

  })
});

function isValidUser(req,res,next){
  if(req.isAuthenticated()) {next();}
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}


module.exports = router;
