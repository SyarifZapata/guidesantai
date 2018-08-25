const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
  return MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) return console.log(err);
    var db = client.db('aliceApp');

    closure(db);
  });
};

const sendError = (err,res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

//response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// get users categories
router.get('/users/:user', (req, res) => {
  var user = req.params.user;
  connection((db) => {
    db.collection('users')
      .find({name:user},{projection: {categories: 1}})
      .toArray()
      .then((users) => {
        response.data = users[0].categories;
        res.json(response);
      })
      .catch((err) =>{
        sendError(err,res);
      });
  });
});


// insert User
router.post('/users/insert', (req,res,next) => {
  var user = req.body;
  console.log(user);
  connection((db) => {
    db.collection("users")
      .save(user, (err,rec) =>{
        if(err){
          res.send(err);
        }else {
          res.json(rec);
        }
      });
    console.log("1 user inserted");
  });
});


// insert categories
router.post('/users/:user/insert', (req,res,next) => {
  var user = req.body;
  console.log(user);
  // //Add filter here
   connection((db) => {
     db.collection("users")
       .updateOne({name:"syarif"},{$push:{categories: user}})
       .catch((err) =>{
         sendError(err,res);
       });
      console.log("1 document inserted");
    });
});


module.exports = router;
