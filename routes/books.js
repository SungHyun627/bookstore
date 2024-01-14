const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { getAllBooksInfo, getBookInfo } = require('../controllers/bookController');

router.use(express.json());

router.get('/', getAllBooksInfo);
router.get('/:id', getBookInfo);

module.exports = router;
