const express = require('express');

const router = express.Router();
const { addLike, removeLike } = require('../controllers/likeController');

router.use(express.json());

router.route('/:id').post(addLike).delete(removeLike);

module.exports = router;
