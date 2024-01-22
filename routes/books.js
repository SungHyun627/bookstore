const express = require('express');

const router = express.Router();
const { getAllBooksInfo, getBookInfo } = require('../controllers/bookController');
const { validatesGetAllBooks, validateBook } = require('../middlewares/bookMiddleware');

router.use(express.json());

router.get('/', validatesGetAllBooks, getAllBooksInfo);
router.get('/:id', validateBook, getBookInfo);

module.exports = router;
