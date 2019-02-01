const Sequelize = require('sequelize');
const connection = require('../connection');

const FacebookUser = connection.define('fb_user', {
  user_id: { type: Sequelize.BIGINT},
  fb_username: { type: Sequelize.STRING(50), allowNull:false },
  facebook_id: { type: Sequelize.BIGINT, primaryKey: true }
});


module.exports = FacebookUser;
