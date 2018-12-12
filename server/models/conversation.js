const Sequelize = require('sequelize');
const connection = require('../connection');

const Conversation = connection.define('conversation', {
  room_id: { type: Sequelize.BIGINT, primaryKey: true},
  from_id: {type: Sequelize.BIGINT, allowNull:false },
  message: {type: Sequelize.STRING},
  url: {type: Sequelize.STRING}
});


module.exports = Conversation;
