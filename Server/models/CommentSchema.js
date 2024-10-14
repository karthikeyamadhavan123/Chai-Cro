const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
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
    }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

const Comment=mongoose.model('Comment',CommentSchema);
module.exports=Comment