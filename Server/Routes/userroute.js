const express = require('express');
const router = express.Router();
const ExistingUser = require('../Middleware/registerMiddleware.js');
const registerController = require('../Controllers/userController.js');
const upload = require('../util/cloudinary.js');
const tokenVerification=require('../Verification/tokenVerification')
// Route for registration with file upload
router.post('/register', upload.single('image'),ExistingUser.existingUser,registerController.Register)
;
router.post('/login', registerController.Login);
router.post('/logout',tokenVerification, registerController.Logout);
router.post('/forgot-password', registerController.forgotPassword);
router.post('/reset-password/:token',registerController.resetPassword);
router.delete('/:userId/delete',tokenVerification,registerController.deleteUser);
router.get('/:userId/image',tokenVerification,registerController.getCurrentUserImage);

module.exports = router;