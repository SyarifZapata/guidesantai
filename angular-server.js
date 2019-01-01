const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const socket = require('socket.io');
const fs = require('fs');

const opts = { key: fs.readFileSync('/home/arkad/server_key.pem')
  , cert: fs.readFileSync('/home/arkad/server_cert.pem')
};

// dotenv allows you to use process.env.<sth> from the .env file
require('dotenv').config();
require('./server/redis-config');

// dist folder is where all the built app located
app.use(express.static(path.join(__dirname, 'dist')));

/* send all request to index html in dist folder */
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

const port = process.env.ANGULAR_PORT || '3003';
app.set('port',port);

const server = https.createServer(opts,app);
server.listen(port, () => console.log(`Running on localhost:${port}`));

const io = socket(server);
require('./server/socket-io/chat').chatSocket(io);

