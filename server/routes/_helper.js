const bcrypt = require('bcrypt');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compare(userPassword,databasePassword);
}

module.exports = {comparePass};
