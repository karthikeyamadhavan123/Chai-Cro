const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductCommentSchema = new Schema({
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
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    
}, { timestamps: true }); // adds createdAt and updatedAt automatically

const ProductComment=mongoose.model('ProductComment',ProductCommentSchema);
module.exports=ProductComment