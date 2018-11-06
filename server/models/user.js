const Sequelize = require('sequelize');
const connection = require('../connection');

const User = connection.define('user', {
  user_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
  username: { type: Sequelize.STRING(30), allowNull:false },
  email: { type: Sequelize.STRING(50), allowNull: false },
  password: { type: Sequelize.STRING(100), allowNull: false },
  login_strategy: { type: Sequelize.STRING(10), defaultValue: 'local'}
});


module.exports = User;
