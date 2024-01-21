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
  validatePasswordReset,
} = require('../middlewares/userMiddleware');

router.use(express.json());

router.post('/signup', validateSignUp, signUp);

router.post('/signin', validateSignIn, signIn);

router
  .route('/reset')
  .post(validatePasswordResetRequest, passwordResetRequest)
  .put(validatePasswordReset, passwordReset);

module.exports = router;
