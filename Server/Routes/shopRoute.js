const express = require('express');
const router = express.Router();
const upload = require('../util/cloudinary.js');
const shopController = require('../Controllers/ShopController.js');
const tokenVerification=require('../Verification/tokenVerification')
router.post('/new/:id', tokenVerification,upload.single('shop_image'), shopController.createShop);
router.get('/allShops',tokenVerification,shopController.getShops)
router.delete('/:userId/:shop_id/delete',tokenVerification,shopController.deleteShop)
router.put('/:userId/:shop_id/edit',tokenVerification,upload.single('shop_image'),shopController.editShop)
module.exports = router;