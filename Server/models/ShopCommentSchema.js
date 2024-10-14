const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShopCommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    
}, { timestamps: true }); // adds createdAt and updatedAt automatically

const ShopComment=mongoose.model('ShopComment',ShopCommentSchema);
module.exports=ShopComment