const Sequelize = require('sequelize');
const connection = require('../connection');

const FacebookUser = connection.define('fb_user', {
  user_id: { type: Sequelize.BIGINT, primaryKey: true },
  username: { type: Sequelize.STRING(50), allowNull:false },
  picture: { type: Sequelize.STRING },
  login_strategy: { type: Sequelize.STRING(10), defaultValue: 'facebook'},
  twoFASecret: {type: Sequelize.STRING(100)},
  twoFAEnabled: {type: Sequelize.BOOLEAN, defaultValue: 'false'}
});


module.exports = FacebookUser;
