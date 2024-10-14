const express = require('express');
const router = express.Router();
const ProductCommentController = require('../Controllers/ProductCommentController');
const tokenVerification=require('../Verification/tokenVerification')

router.post('/:userId/:productId/add',tokenVerification,ProductCommentController.addComment)
router.get('/:productId/all',tokenVerification,ProductCommentController.getAllCommentofProduct)
router.put('/:userId/:productId/:commentId/edit',tokenVerification,ProductCommentController.editProductComment)
router.delete('/:userId/:productId/:commentId/delete',tokenVerification,ProductCommentController.deleteProductComment)

module.exports=router