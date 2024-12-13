const mongoose = require('mongoose');
const Shop = require('./ShopSchema');
const Product = require('./productSchema');
const ShopComment = require('./ShopCommentSchema');
const ShopRating = require('./ShopRating');
const ProductComment=require('./ProductCommentSchema')
const ProductRating=require('./ProductRatingSchema')
const Address=require('./addressSchema')
const { Schema } = mongoose;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
       
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    image: {
        type: String,
        required: false // Made optional
    },
    userType: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
    addresses:[{
        type: Schema.Types.ObjectId,
        ref: "Address",
    }]
}, {timestamps: true});

userSchema.post('findOneAndDelete',async(doc)=>{
    const userId=doc._id
    try {
        await Shop.deleteMany({shop_owner:userId})
        await Product.deleteMany({owner:userId})
        await ShopComment.deleteMany({user:userId})
        await ShopRating.deleteMany({user:userId})
        await ProductComment.deleteMany({user:userId})
        await ProductRating.deleteMany({user:userId})
        await Address.deleteMany({user:userId})
    } catch (error) {
        console.error(`Error deleting products for user ID: ${userId}`, error);
    }
})
const User = mongoose.model("User", userSchema);
module.exports = User;
