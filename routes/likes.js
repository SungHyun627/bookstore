const express = require('express');

const router = express.Router();
const { addLike } = require('../controllers/likeController');

router.use(express.json());

router
  .route('/:id')
  .post(addLike)
  // 좋아요 취소
  .delete((req, res) => {
    res.json({
      message: '좋아요 취소',
    });
  });

module.exports = router;
