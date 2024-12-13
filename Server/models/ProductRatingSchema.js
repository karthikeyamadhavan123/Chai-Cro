const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema=new Schema({
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
    product:{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
})

const ProductRating=mongoose.model('ProductRating',ratingSchema);
module.exports=ProductRating;