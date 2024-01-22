const express = require('express');
const { addTocart, getCartItems, removeCartItem } = require('../controllers/cartController');
const { validateAddToCart } = require('../middlewares/cartmiddleware');

const router = express.Router();

router.use(express.json());

router.route('/').post(validateAddToCart, addTocart).get(getCartItems);

router.delete('/:id', removeCartItem);

module.exports = router;
