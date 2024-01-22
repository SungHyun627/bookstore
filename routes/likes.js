const express = require('express');

const router = express.Router();
const { addLike, removeLike } = require('../controllers/likeController');
const { validateLike } = require('../middlewares/likemiddleware');

router.use(express.json());

router.route('/:id').post(validateLike, addLike).delete(validateLike, removeLike);

module.exports = router;
