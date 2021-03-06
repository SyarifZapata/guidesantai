const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FacebookUser = require('../models/facebookUser');
const PendingRequest = require('../models/pendingRequest');
const ChatFriend = require('../models/chatFriend');
const Conversation = require('../models/conversation');


router.post('/finduser', isValidUser, (req,res,next) => {
  let name = req.body.username;
  let yourId;
  if (req.user){
    yourId = req.user.user_id;
  }
  let data = [];
  User.findAll({attributes: ['user_id','username', 'picture'],where:{username: name}}).then((users) => {
    data = data.concat(users);
    let fb = fbusers.map(a => a.user_id);
    let normal = users.map(a => a.user_id);
    const result = fb.concat(normal);
    console.log(result);
    PendingRequest.findAll({where: {from_id:yourId, to_id: result }}).then((request) => {
      console.log(request);
      res.status(200).json({data:data, pending: request})
    });

  });
});

router.post('/invitechat', isValidUser, (req,res,next) => {
  let to_id = req.body.to_id;
  let from_id;
  if(req.user){
    from_id = req.user.user_id;
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
  if(req.user){
    from_id = req.user.user_id;
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
  let from_id;
  if(req.user){
    from_id = req.user.user_id;
  }else{
    from_id = req.user.user_id
  }
  PendingRequest.destroy({where:{from_id:from_id,to_id:id}}).then((result) => {
    res.status(200).json(result);
  })
});

router.post('/acceptrequest', isValidUser, (req,res,next) => {
  const from_id = req.body.id;
  let to_id;
  if(req.user){
    to_id = req.user.user_id;
  }else{
    to_id = req.user.user_id
  }
  ChatFriend.create({
    user_id1: from_id,
    user_id2: to_id,
    secretkey_id2: req.body.key,
    pending_secret: req.body.pending
  }).then((data)=>{
    res.status(200).json({data:data});
  })
});

router.get('/getfriends', isValidUser, (req,res,next) => {
  let yourId;
  if(req.user){
    yourId = req.user.user_id;
  }else{
    yourId = req.user.user_id
  }
  let friendIds = [];
  let friends = [];
  ChatFriend.findAll({raw:true, attributes: ['user_id2'], where:{user_id1:yourId}}).then((ids) => {
    let id = ids.map(a => a.user_id2);
    friendIds = friendIds.concat(id);

    ChatFriend.findAll({raw:true, attributes: ['user_id1'], where:{user_id2:yourId}}).then((idds) => {
      let id = idds.map(a => a.user_id1);
      friendIds = friendIds.concat(id);
      console.log(friendIds);
      User.findAll({raw:true, attributes: ['user_id','username', 'picture'],where:{user_id:friendIds}}).then((users) => {
        friends = friends.concat(users);

        res.status(200).json({data:friends})

      });
    })
  })
});

router.post('/rejectrequest', isValidUser, (req,res,next) => {
  const from_id = req.body.id;
  let to_id;
  if(req.user){
    to_id = req.user.user_id;
  }else{
    to_id = req.user.user_id
  }
  PendingRequest.destroy({where:{from_id:from_id,to_id:to_id}}).then((result) => {
    res.status(200).json(result);
  })
});

router.get('/needtoapprove', isValidUser, (req,res,next) => {
  let id;
  if(req.user){
    id = req.user.user_id;
  }else{
    id = req.user.user_id;
  }
  PendingRequest.findAll({where:{to_id:id}}).then((users) => {
    const result = users.map(a => a.from_id);
    let data = [];
    User.findAll({attributes: ['user_id','username', 'picture'],where:{user_id:result}}).then((users) => {
      data = data.concat(users);
      res.status(200).json({data:data})
    });
  })
});


router.post('/update-secret', isValidUser, (req,res,next) => {
  let yourId;
  if(req.user){
    yourId = req.user.user_id;
  }else{
    yourId = req.user.user_id
  }
  const their_id = req.body.id;
  ChatFriend.update({secretkey_id1: req.body.secret, pending_secret: ''},{where:{user_id1:yourId, user_id2:their_id}}).then((success) => {
    res.send({success:success});
  });
});


router.post('/getroom', isValidUser, (req,res,next) => {
  let yourId;
  if(req.user){
    yourId = req.user.user_id;
  }else{
    yourId = req.user.user_id
  }
  const their_id = req.body.id;
  ChatFriend.findOne({raw:true, where:{user_id1:yourId, user_id2:their_id}}).then((room) => {
    if(room){
      if(room.secretkey_id1){
        res.status(200).json({room_id:room.room_id, user:their_id, secret:room.secretkey_id1})
      }else {
        res.status(200).json({room_id:room.room_id, user:their_id, pending:room.pending_secret})
      }

    }else{
      ChatFriend.findOne({raw:true, where:{user_id1:their_id, user_id2:yourId}}).then((theroom) => {
        if(theroom) {
          if(theroom.secretkey_id2){
            res.status(200).json({room_id:theroom.room_id, user:their_id, secret:theroom.secretkey_id2})
          }else {
            res.status(200).json({room_id:theroom.room_id, user:their_id, pending:theroom.pending_secret})
          }
        }
      })

    }
  })
});

router.post('/getuser', isValidUser, (req,res,next) => {
  const userid = req.body.id;
  User.findOne({raw:true, where:{user_id:userid}}).then((user)=>{
    res.status(200).json({user:user})
  });
});

router.post('/send', isValidUser, (req, res, next) => {
  Conversation.create({
    room_id: req.body.room_id,
    from_id: req.body.from_id,
    message: req.body.message
  }).then((result) => {
    res.status(200).json(result)
  })
});

router.post('/getmessages', isValidUser, (req, res, next) => {
 const room_id = req.body.room_id;
  let yourId;
  if(req.user){
    yourId = req.user.user_id;
  }else{
    yourId = req.user.user_id
  }
 ChatFriend.findOne({raw:true, where:{room_id:room_id}}).then((result)=>{
   let secret;
   if(result.user_id1 === yourId){
     secret = result.secretkey_id1;
   }else {
     secret = result.secretkey_id2;
   }
   Conversation.findAll({raw:true, where:{room_id:room_id}}).then((messages)=>{
     res.status(200).json({messages:messages, secret:secret})
   })
 });

});

function isValidUser(req,res,next){
  if(req.isAuthenticated()) {next();}
  else return res.status(401).json({message:'Memberbereich, bitte einloggen'})
}


module.exports = router;
