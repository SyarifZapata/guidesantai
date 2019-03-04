const Sequelize = require('sequelize');
const connection = require('../connection');

const FacebookUser = connection.define('listing', {
  creator_id: { type: Sequelize.BIGINT},
  listing_id: { type: Sequelize.BIGINT, primaryKey: true},
  title: { type: Sequelize.STRING(100), allowNull:false },
  category: {type: Sequelize.INT, allowNull: false},
  price: {type: Sequelize.DECIMAL(10,2)},
  description: {type: Sequelize.TEXT}
});


module.exports = FacebookUser;
