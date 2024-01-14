const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/userController');
const { validateSignUp, validateSignIn } = require('../middlewares/userMiddleware');

router.use(express.json());

// 회원가입
router.post('/signup', validateSignUp, signup);

// 로그인
router.post('/signin', validateSignIn, signin);

router
  .route('/reset')
  // 비밀번호 초기화 요청
  .post((req, res) => {
    res.json({
      message: '비밀번호 초기화 요청',
    });
  })
  // 비밀번호 초기화
  .put((req, res) => {
    res.json({
      message: '비밀번호 초기화',
    });
  });

module.exports = router;
