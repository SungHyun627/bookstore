const crypto = require('crypto');

const getHashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
};

module.exports = { getHashPassword };
