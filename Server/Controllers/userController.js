const bcrypt = require('bcrypt');
const jwt = require('../jwt/jwt');
const User = require('../models/userSchema.js');
const cloudinary = require('cloudinary').v2; // Assuming Cloudinary is configured here
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const crypto = require('../util/crypto.js');
const { welcomeEmail,sendVerificationEmail,sendResetEmailSuccessful,sendAccountDeletionEmail } = require('../nodemailer/nodemailer.js');

const Register = async (req, res) => {
    try {
        const saltRounds = 10;
        const { username, email, password, userType } = req.body;

        // Ensure an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Image is required." });
        }

        // Validate required fields
        if (!username || !email || !password || !userType) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate a random token for email verification (if needed)
        const verificationToken = crypto.generateToken(16)

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'user_images', // You can adjust the folder as per your need
            resource_type: 'image',  // Specify the resource type as image
            allowed_formats: ['jpeg', 'jpg', 'png'],  // Allow only image formats
        })

        // Get the secure URL of the uploaded image
        const imageUrl = result.secure_url;

        // Create a new user object and save to the database
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image: imageUrl,
            userType,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,  // Token expires in 24 hours
        });

        await newUser.save();

        // Generate a JWT token for the newly created user
        const userId = newUser._id;
        const token = jwt.createToken({ userId });

        // Send a welcome email to the user
        await welcomeEmail(newUser.email);

        // Return a success response with the user information and token
        return res.status(201).json({
            userId,
            token,
            username,
            userType,
        });

    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
const Login = async (req, res) => {
    try {

        const { email, password } = req.body;
        // Ensure a file is uploaded


        // Validation checks

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }


        // Hash the password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(403).json({ message: "Passwords Not Matched." });
        }

        const userId = user._id;
        const token = jwt.createToken({ userId });
        const username = user.username
        const usertype = user.userType

        // Send response with the new user data and token
        return res.status(201).json({ token, username, usertype, userId });

    } catch (error) {
        console.log(error); // Log the error for debugging
        return res.status(500).json({success:false,error:error.message}); // Send a generic error message to the client
    }
}

const Logout = async (req, res) => {
    try {
return res.status(200).json({success:true,message:'Logout Successful'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error:error.message});
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User Not Exist');
        }
        const token = crypto.generateToken(17);
        const resetPasswordTokenexpires = Date.now() + 1 * 60 * 60 * 1000
        user.resetPasswordToken = token
        user.resetPasswordExpiresAt = resetPasswordTokenexpires
        await user.save();
        await sendVerificationEmail(user.email, token)
        return res.status(200).json({ message: 'Reset Pssword Email Successfully sent', success: true, resetToken: token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error:error.message});
    }


}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body;
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).send('ResetToken Expired Or not Provided');
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        user.password = hashedpassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save();
        await sendResetEmailSuccessful(user.email);
        return res.status(200).json({ success: true, message: 'Password Reset Successful' })


    } catch (error) {
        console.log(error);
       return res.status(500).send('Internal Server Error');
    }
}

const deleteUser=async(req,res)=>{
    try {
        const {userId}=req.params;
        
        if(!userId){
            return res.status(401).send('userid not present')
        }
        const user=await User.findById(userId);
        const email=user.email
        const username=user.username
        if(!user){
            return res.status(404).send('user not present')

        }
        await User.findByIdAndDelete(userId);
        await sendAccountDeletionEmail(email,username)

        return res.status(200).send('user deleted successfully')
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message});   
    }
}
const getCurrentUserImage = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required." });

        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "user not  present." });
        }
        const image=user.image;
       
        return res.status(200).json({ userimage: image });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message,success:false})
    }
}
module.exports = {
    Register,
    Login,
    Logout,
    forgotPassword,
    resetPassword,
    deleteUser,
    getCurrentUserImage
};
