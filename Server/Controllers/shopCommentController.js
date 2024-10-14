const ShopComment = require('../models/ShopCommentSchema');
const Shop = require('../models/ShopSchema');
const User = require('../models/userSchema');

const addComment = async (req, res) => {
    try {
        const { shopId, userId } = req.params;
        const { comment } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shopId is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ error: 'comment is required and cannot be empty' });
        }

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newShopComment = new ShopComment({
            comment: comment.trim(),
            user: userId,
            shop: shopId
        });

        await newShopComment.save();

        shop.shop_comments.push(newShopComment._id);
        await shop.save();

        return res.status(201).json({ message: 'Shop comment created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllCommentofShop = async (req, res) => {
    try {
        const { shop_id } = req.params;
        if (!shop_id) {
            return res.status(400).json({ error: 'shopId is required' });
        }
        const shopComment = await Shop.findById(shop_id).populate({
            path: 'shop_comments',
            select: '_id comment',
            populate: {
                path: 'user',
                select: 'username image'
            }
        })

        if (!shopComment) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        return res.status(200).json({ success: true, comments: shopComment })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editShopComment = async (req, res) => {
    try {
        const { userId, commentId, shopId } = req.params;
        const { editedComment } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!commentId) {
            return res.status(400).json({ error: 'commentId is required' });
        }
        if (!shopId) {
            return res.status(400).json({ error: 'shopId is required' });
        }
        if (!editedComment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ error: 'shop not found' });
        }

        const comment = await ShopComment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ error: 'comment not found' });
        }
        if (!comment.user.equals(user._id) || !comment.shop.equals(shop._id)) {
            return res.status(403).json({ error: 'You are not authorized edit comment' });
        }
        comment.comment = editedComment
        await comment.save()
        return res.status(200).json({ success: true, message: "successfully edited shop comment" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteShopComment = async (req, res) => {
    try {
        const { userId, commentId, shopId } = req.params;


        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!commentId) {
            return res.status(400).json({ error: 'commentId is required' });
        }
        if (!shopId) {
            return res.status(400).json({ error: 'shopId is required' });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ error: 'shop not found' });
        }

        const comment = await ShopComment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ error: 'comment not found' });
        }
        if (!comment.user.equals(user._id) || !comment.shop.equals(shop._id)) {
            return res.status(403).json({ error: 'You are not authorized delete comment' });
        }
        shop.shop_comments.pull(commentId);
        await shop.save()
        await ShopComment.findByIdAndDelete(commentId);

        return res.status(200).json({ success: true, message: "successfully deleted shop comment" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    addComment,
    getAllCommentofShop,
    editShopComment,
    deleteShopComment
};
