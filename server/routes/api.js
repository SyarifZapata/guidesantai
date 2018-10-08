const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const {Pool} = require('pg');

const pool = new Pool({
  user: 'arkad',
  host: 'localhost',
  database: 'recipedb',
  password: '71522-Bkneu',
  port: 5432,
});

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


router.get('/saya', (req, resp)=>{
  const text = 'INSERT INTO recipe(recipe_id, name, category, author_id) VALUES($1, $2, $3, $4) RETURNING *';
  const values = [5, 'ikan masala', 'santan', 1];

  pool.connect((err, client, done) => {
    if (err) throw err;

    client.query(text,values, (err, res) => {

      if (err) {
        console.log(err.stack)
      } else {
        response.data = res.rows[0];
        resp.json(response);
        console.log(res.rows[0])
      }
      pool.end();
    })
  });
});

// // Connect
// const connection = (closure) => {
//   return MongoClient.connect('mongodb://localhost:27017', (err, client) => {
//     if (err) return console.log(err);
//     var db = client.db('aliceApp');
//
//     closure(db);
//   });
// };
//

//
// // get users categories
// router.get('/users/:user', (req, res) => {
//   var user = req.params.user;
//   connection((db) => {
//     db.collection('users')
//       .find({name:user},{projection: {categories: 1}})
//       .toArray()
//       .then((users) => {
//         response.data = users[0].categories;
//         res.json(response);
//       })
//       .catch((err) =>{
//         sendError(err,res);
//       });
//   });
// });
//
//
// // insert User
// router.post('/users/insert', (req,res,next) => {
//   var user = req.body;
//   console.log(user);
//   connection((db) => {
//     db.collection("users")
//       .save(user, (err,rec) =>{
//         if(err){
//           res.send(err);
//         }else {
//           res.json(rec);
//         }
//       });
//     console.log("1 user inserted");
//   });
// });
//
//
// // insert categories
// router.post('/users/:user/insert', (req,res,next) => {
//   var user = req.params.user;
//   var categories = req.body;
//   console.log(user);
//   // //Add filter here
//    connection((db) => {
//      db.collection("users")
//        .updateOne({name:user},{$push:{categories: {$each:categories}}}, (err,rec) => {
//          if(err){
//            res.send(err);
//          }else {
//            res.json(rec);
//            console.log("document/s inserted");
//          }
//        });
//
//
//     });
// });


module.exports = router;
