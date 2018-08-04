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

// get users
router.get('/categories', (req, res) => {
  connection((db) => {
    db.collection('categories')
      .find()
      .toArray()
      .then((categories) => {
        response.data = categories;
        res.json(response);
      })
      .catch((err) =>{
        sendError(err,res);
      });
  });
});

module.exports = router;
