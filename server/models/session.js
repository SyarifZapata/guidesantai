const Sequelize = require('sequelize');
const connection = require('../connection');

const Session = connection.define('Session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  expires:Sequelize.DATE,
  data: Sequelize.STRING(50000)
});


module.exports = Session;
