const express = require('express');
const router = express.Router();
const ProductRatingController = require('../Controllers/ProductRatingController');
const tokenVerification=require('../Verification/tokenVerification')

router.post('/:userId/:productId/add',tokenVerification,ProductRatingController.addProductRating)
router.get('/:productId/all',tokenVerification,ProductRatingController.getAllRatingofProduct)
router.put('/:userId/:productId/:ratingId/edit',tokenVerification,ProductRatingController.editProductRating)
router.delete('/:userId/:productId/:ratingId/delete',tokenVerification,ProductRatingController.deleteProductRating)

module.exports=router