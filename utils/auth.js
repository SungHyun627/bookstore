const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers.authorization;
    if (receivedJwt) {
      const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
      return decodedJwt;
    }
    throw new ReferenceError('Jwt 토큰이 제공 되어야 합니다.');
  } catch (err) {
    return err;
  }
};

module.exports = ensureAuthorization;
