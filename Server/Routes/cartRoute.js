const express = require('express');
const router = express.Router();
const CartController = require('../Controllers/cartController');
const tokenVerification=require('../Verification/tokenVerification')
router.post('/:userId/:productId/add',tokenVerification,CartController.addToCart)
router.delete('/:userId/:productId/delete',tokenVerification,CartController.deleteCartItems)
router.get('/:userId/cart-items',tokenVerification,CartController.getCartItems)

module.exports=router