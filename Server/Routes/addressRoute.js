const express = require('express');
const router = express.Router();
const AddressController = require('../Controllers/addressController');
const tokenVerification=require('../Verification/tokenVerification')
router.post('/:userId/add',tokenVerification,AddressController.addAddress)
router.delete('/:userId/:addressId/delete',tokenVerification,AddressController.deleteAddress)
router.get('/:userId',tokenVerification,AddressController.getAddress)
router.put('/:userId/:addressId/edit',tokenVerification,AddressController.EditAddress)

module.exports=router