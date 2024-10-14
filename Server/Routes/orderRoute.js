const express = require('express');
const router = express.Router();
const OrderController = require('../Controllers/orderController');
const tokenVerification=require('../Verification/tokenVerification')

router.post('/:userId/:productId/place',tokenVerification,OrderController.placeOrder)

module.exports=router