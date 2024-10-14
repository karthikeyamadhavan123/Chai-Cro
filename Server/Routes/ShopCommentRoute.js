const express = require('express');
const router = express.Router();
const shopCommentController = require('../Controllers/shopCommentController');
const tokenVerification=require('../Verification/tokenVerification')

router.post('/:userId/:shopId/add',tokenVerification,shopCommentController.addComment)
router.get('/:shop_id/all',tokenVerification,shopCommentController.getAllCommentofShop)
router.put('/:userId/:shopId/:commentId/edit',tokenVerification,shopCommentController.editShopComment)
router.delete('/:userId/:shopId/:commentId/delete',tokenVerification,shopCommentController.deleteShopComment)
module.exports=router