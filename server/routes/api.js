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
        console.log(response.data);
        res.json(response);
      })
      .catch((err) =>{
        sendError(err,res);
      });
  });
});


// insert users
router.post('/users/insert', (req,res,next) => {
  var user = req.body;
  //Add filter here
  connection((db) => {
    db.collection("users").insertOne(user, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});


module.exports = router;
