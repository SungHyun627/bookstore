const express = require('express');
const { getAllCategories } = require('../controllers/categoryController');

const router = express.Router();

router.use(express.json());

router.get('/', getAllCategories);

module.exports = router;
