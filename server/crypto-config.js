const crypto = require('crypto');
const assert = require('assert');


// const diffieHellmanKey = crypto.createDiffieHellman(1536);
const diffieHellmanKey = crypto.createDiffieHellman(256);
console.log('successfully generated diffie-Hellman');
const getPrime = diffieHellmanKey.getPrime();
const getGenerator = diffieHellmanKey.getGenerator();




module.exports = {getPrime:getPrime, getGenerator: getGenerator};
