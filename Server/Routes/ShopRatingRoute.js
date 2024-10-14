const express = require('express');
const router = express.Router();
const ShopRatingController=require('../Controllers/ratingshopcontroller')
const tokenVerification=require('../Verification/tokenVerification')

router.post('/:userId/:shopId/add',tokenVerification,ShopRatingController.addRating)
router.get('/:shop_id/all',tokenVerification,ShopRatingController.getAllRatingofShop)
router.put('/:userId/:shopId/:ratingId/edit',tokenVerification,ShopRatingController.editShopRating)
router.delete('/:userId/:shopId/:ratingId/delete',tokenVerification,ShopRatingController.deleteShopRating)
module.exports=router