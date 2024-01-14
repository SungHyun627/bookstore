const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  passwordResetRequest,
  passwordReset,
} = require('../controllers/userController');
const {
  validateSignUp,
  validateSignIn,
  validatePasswordResetRequest,
} = require('../middlewares/userMiddleware');

router.use(express.json());

router.post('/signup', validateSignUp, signUp);

router.post('/signin', validateSignIn, signIn);

router.route('/reset').post(validatePasswordResetRequest, passwordResetRequest).put(passwordReset);

module.exports = router;
