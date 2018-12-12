const Sequelize = require('sequelize');
const connection = require('../connection');

const ChatFriend = connection.define('chat_friend', {
  room_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
  user_id1: {type: Sequelize.BIGINT, allowNull:false },
  user_id2: {type: Sequelize.BIGINT, allowNull: false },
  secretkey_id1:{type: Sequelize.BIGINT},
  secretkey_id2:{type: Sequelize.BIGINT},
});


module.exports = ChatFriend;
