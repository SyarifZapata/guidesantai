const redis = require('redis');
let client;


module.exports = {
  chatSocket : function(io) {
    io.on('connection', function (socket) {
      console.log('This is a message from chat module');

      let key;

      socket.on('username', (username) => {
        key = username;
        client.hset(username, "isOnline", "true", redis.print);
      });

      socket.on('message', function (message) {
        console.log('from console', message);
        io.sockets.emit('message', message)
      });

      socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data)
      });

      socket.on('disconnect', function () {
        client.del(key);
        console.log('user ' + key + ' disconnected')
      });

    })
  },

    setClient : function (inClient) {
    client = inClient;
  }
};
