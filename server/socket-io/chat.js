module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('This is a message from chat module');

    socket.on('message', function(message) {
      logger.log('info',message.value);
      socket.emit('ditConsumer',message.value);
      console.log('from console',message.value);
    });

  });

};
