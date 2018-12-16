const Sequelize = require('sequelize');
const connection = require('../connection');

const U2fKey = connection.define('u2f_key', {
  user_id: { type: Sequelize.BIGINT, primaryKey: true},
  public_key: { type: Sequelize.STRING, allowNull:false },
  key_handle: { type: Sequelize.STRING, allowNull:false },
  challenge: { type: Sequelize.STRING, allowNull:false }
});


module.exports = U2fKey;
