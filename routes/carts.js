const express = require('express');
const { addTocart, getCartItems, removeCartItem } = require('../controllers/cartController');

const router = express.Router();

router.use(express.json());

router.route('/').post(addTocart).get(getCartItems);

router.delete('/:id', removeCartItem);

module.exports = router;
