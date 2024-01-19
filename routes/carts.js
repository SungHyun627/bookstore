const express = require('express');
const { addTocart, getCartItems, removeCartItem } = require('../controllers/cartController');

const router = express.Router();

router.use(express.json());

router.route('/').post(addTocart).get(getCartItems);

router.delete('/:id', removeCartItem);

// 장바구니에서 선택한 주문 예상 상품 목록 조회
router.get('/', (req, res) => {
  res.json({
    message: '장바구니에서 선택한 주문 예상 상품 목록 조회',
  });
});

module.exports = router;
