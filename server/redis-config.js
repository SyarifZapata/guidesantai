const redis = require('redis');
const client = redis.createClient(); //port 6379, 127.0.0.1
const chatModule = require('./socket-io/chat');
const authModule = require('./routes/auth');

client.on('connect', function () {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong '+ err)
});

client.flushdb((err,succeded) => {
  console.log(succeded)
});

chatModule.setClient(client);
authModule.setClient(client);
