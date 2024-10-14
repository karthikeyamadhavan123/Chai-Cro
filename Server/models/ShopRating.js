const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShopratingSchema=new Schema({
    rating:{
        type: Number,
        required: true,
        min: [0, "rating cannot be negative"]
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shop_rating:{
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    }
})

const ShopRating=mongoose.model('ShopRating',ShopratingSchema);
module.exports=ShopRating;