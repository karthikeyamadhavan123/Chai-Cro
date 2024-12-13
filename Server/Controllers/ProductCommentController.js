const ProductComment = require('../models/ProductCommentSchema');
const Product = require('../models/productSchema');
const User = require('../models/userSchema');

const addComment = async (req, res) => {
    try {
        const { productId, userId } = req.params;
        const { comment } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ error: 'comment is required and cannot be empty' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newProductComment = new ProductComment({
            comment: comment.trim(),
            user: userId,
            product: productId
        });

        await newProductComment.save();

        product.comments.push(newProductComment._id);
        await product.save();

        return res.status(201).json({ message: 'Product comment created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllCommentofProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }

        const productComment = await Product.findById(productId)
            .populate({
                path: 'comments',
                select: '_id comment',
                populate: {
                    path: 'user',
                    select: '_id username', // Fetch only the user _id and username
                },
            });

        if (!productComment) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        return res.status(200).json({ success: true, comments: productComment })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editProductComment = async (req, res) => {
    try {
        const { userId, commentId, productId } = req.params;
        const { editedCommentText} = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!commentId) {
            return res.status(400).json({ error: 'commentId is required' });
        }
        if (!productId) {
            return res.status(400).json({ error: 'shopId is required' });
        }
        if (!editedCommentText) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        const comment = await ProductComment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ error: 'comment not found' });
        }
        if (!comment.user.equals(user._id) || !comment.product.equals(product._id)) {
            return res.status(403).json({ error: 'You are not authorized edit comment' });
        }
        comment.comment = editedCommentText
        await comment.save()
        return res.status(200).json({ success: true, message: "successfully edited product comment" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteProductComment = async (req, res) => {
    try {
        const { userId, commentId, productId } = req.params;


        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!commentId) {
            return res.status(400).json({ error: 'commentId is required' });
        }
        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        const comment = await ProductComment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ error: 'comment not found' });
        }
        if (!comment.user.equals(user._id) || !comment.product.equals(product._id)) {
            return res.status(403).json({ error: 'You are not authorized delete comment' });
        }
        product.comments.pull(commentId);
        await product.save()
        await ProductComment.findByIdAndDelete(commentId);

        return res.status(200).json({ success: true, message: "successfully deleted product comment" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    addComment,
    getAllCommentofProduct,
    editProductComment,
    deleteProductComment
};
