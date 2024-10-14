const express = require('express');
const router = express.Router();
const upload = require('../util/cloudinary.js');
const productController = require('../Controllers/productController.js');
const tokenVerification=require('../Verification/tokenVerification')
router.post('/:id/newproducts',tokenVerification,upload.single('product_image'),productController.createProducts);
router.get('/:shop_id/products',tokenVerification,productController.getShopProducts)
router.delete('/:productId/:shop_id/delete/products',tokenVerification,productController.deleteProducts);
router.put('/:productId/:shop_id/edit/products',tokenVerification,upload.single('product_image'),productController.editShopProducts);
module.exports = router;