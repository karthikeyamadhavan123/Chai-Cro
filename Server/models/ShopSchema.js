<<<<<<< HEAD
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
const Product=require('../models/productSchema')
    const ShopSchema = new Schema({
        shop_name: {
            type: String,
            required: true,
            minLength: [2, "Shop name should be at least 2 characters"]
        },
        postalCode: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\d{6}$/.test(v); // Regex to check if postal code is exactly 6 digits
                },
                message: props => `${props.value} is not a valid 6-digit postal code!`
            }
        },
        shop_address: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        shop_products: [{
            type: Schema.Types.ObjectId,
            ref: "Product",
            
        }],
        shop_owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        shop_image:{
            type:String,
            required:true,
        },
        ratings:[{
            type: Schema.Types.ObjectId,
            ref: "Ratings", // Reference to the Shop schema
            
        }],
        shop_comments:[{
            type: Schema.Types.ObjectId,
            ref: "Comments",
        }]
    });

    
    ShopSchema.post('findOneAndDelete', async (doc) => { // always define it before schema and exports
        const shopId = doc._id;
        try {
            await Product.deleteMany({shop:shopId})
          
           
            
        } catch (error) {
            console.error(`Error deleting products for shop ID: ${shopId}`, error);
        }
       
    
    })
    const Shop = mongoose.model('Shop', ShopSchema);
    module.exports = Shop;
   
=======
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('../models/productSchema');
const ShopComment = require('./ShopCommentSchema');
const ShopRating = require('./ShopRating');
const ShopSchema = new Schema({
    shop_name: {
        type: String,
        required: true,
        minLength: [2, "Shop name should be at least 2 characters"]
    },
    postalCode: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{6}$/.test(v); // Regex to check if postal code is exactly 6 digits
            },
            message: props => `${props.value} is not a valid 6-digit postal code!`
        }
    },
    shop_address: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    shop_products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",

    }],
    shop_owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shop_image: {
        type: String,
        required: true,
    },
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: "ShopRating",
       // Reference to the Shop schema

    }],
    shop_comments: [{
        type: Schema.Types.ObjectId,
        ref: "ShopComment",
    }],
    // country:{
    //     type: String,
    //     required: true,
    // }
});


ShopSchema.post('findOneAndDelete', async (doc) => { // always define it before schema and exports
    const shopId = doc._id;
    try {
        await Product.deleteMany({ shop: shopId })
        await ShopComment.deleteMany({shop:shopId})
        await ShopRating.deleteMany({shop_rating:shopId})

    } catch (error) {
        console.error(`Error deleting products for shop ID: ${shopId}`, error);
    }


})
const Shop = mongoose.model('Shop', ShopSchema);
module.exports = Shop;
>>>>>>> 3e5badb (Your commit message)
