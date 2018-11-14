module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('This is a message from chat module');

    socket.on('message', function(message) {
      console.log('from console',message);
      io.sockets.emit('message',message)
    });

    socket.on('typing', function (data) {
      socket.broadcast.emit('typing', data)
    })

  });

};
