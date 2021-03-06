const Sequelize = require('sequelize');
const connection = require('../connection');

const PendingRequest = connection.define('pending_request', {
  request_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
  from_id: { type: Sequelize.BIGINT, allowNull:false },
  to_id: { type: Sequelize.BIGINT, allowNull: false }
});


module.exports = PendingRequest;
