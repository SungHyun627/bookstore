const express = require('express');
const router = express.Router();
const { signUp, signIn, passwordRequest } = require('../controllers/userController');
const { validateSignUp, validateSignIn } = require('../middlewares/userMiddleware');

router.use(express.json());

router.post('/signup', validateSignUp, signUp);

router.post('/signin', validateSignIn, signIn);

router
  .route('/reset')
  .post(passwordRequest)
  // 비밀번호 초기화
  .put((req, res) => {
    res.json({
      message: '비밀번호 초기화',
    });
  });

module.exports = router;
