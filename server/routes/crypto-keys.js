const express = require('express');
const router = express.Router();
const cryptoKey = require('../crypto-config');


router.get('/getKeys', (req,res,next) =>{
  res.status(200).json({
    prime: cryptoKey.getPrime,
    generator: cryptoKey.getGenerator
  })
});

module.exports = router;
