const Sequelize = require('sequelize');
const connection = require('../connection');

const FacebookUser = connection.define('fb_user', {
  facebook_id: { type: Sequelize.BIGINT, primaryKey: true },
  username: { type: Sequelize.STRING(50), allowNull:false },
  login_strategy: { type: Sequelize.STRING(10), defaultValue: 'facebook'}
});


module.exports = FacebookUser;
