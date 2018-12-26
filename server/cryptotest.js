const crypto = require('crypto');
const NodeRSA = require('node-rsa');

const keyrsa = new NodeRSA({b: 512});
const empty = new NodeRSA();
keyrsa.generateKeyPair();
const public = keyrsa.exportKey('pkcs1-public-pem');
const priv = keyrsa.exportKey('pkcs1-private-pem');

empty.importKey(public,'pkcs1-public-pem');
//empty.importKey(priv,'pkcs1-private-pem' );

console.log(empty.isPrivate());


