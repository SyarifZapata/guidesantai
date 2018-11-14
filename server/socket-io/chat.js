var onlineUsers = [];

function isInArray(value,array){
  return array.indexOf(value) > -1;
}

module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('This is a message from chat module');

    socket.on('username', (username)=> {
      onlineUsers.push(username);
    });

    socket.on('message', function(message) {
      console.log('from console',message);
      io.sockets.emit('message',message)
    });

    socket.on('typing', function (data) {
      socket.broadcast.emit('typing', data)
    });

    socket.on('disconnect', function () {
      console.log('user disconnected')
    });

  });

};
