const Shop = require('../models/ShopSchema');
const User = require('../models/userSchema');
const ShopRating=require('../models/ShopRating')
const addRating=async(req,res)=>{
    try {
        const { shopId, userId } = req.params;
        const { rating } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shopId is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!rating) {
            return res.status(400).json({ error: 'rating is required and cannot be empty' });
        }

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newShopRating = new ShopRating({
            rating:rating,
            user: userId,
            shop_rating: shopId
        });

        await newShopRating.save();

        shop.ratings.push(newShopRating._id);
        await shop.save();

        return res.status(201).json({ message: 'Shop Rating created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllRatingofShop=async(req,res)=>{
    try {
        const { shop_id } = req.params;
        if (!shop_id) {
            return res.status(400).json({ error: 'shopId is required' });
        }
        const shopRatings = await Shop.findById(shop_id).populate({
            path: 'ratings',
            select: '_id rating'
        })
        if (!shopRatings) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        return res.status(200).json({ success: true, ratings: shopRatings })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editShopRating=async(req,res)=>{
    try {
        const { userId, ratingId, shopId } = req.params;
        const { editedRating } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!ratingId) {
            return res.status(400).json({ error: 'ratingId is required' });
        }
        if (!shopId) {
            return res.status(400).json({ error: 'shopId is required' });
        }
        if (!editedRating) {
            return res.status(400).json({ error: 'Rating is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ error: 'shop not found' });
        }

        const rating = await ShopRating.findById(ratingId)
        if (!rating) {
            return res.status(404).json({ error: 'rating not found' });
        }
        if (!rating.user.equals(user._id) || !rating.shop_rating.equals(shop._id)) {
            return res.status(403).json({ error: 'You are not authorized edit comment' });
        }
        rating.rating = editedRating
        await rating.save()
        return res.status(200).json({ success: true, message: "successfully edited shop rating" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteShopRating = async (req, res) => {
    try {
        const { userId, ratingId, shopId } = req.params;


        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!ratingId) {
            return res.status(400).json({ error: 'ratingId is required' });
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

        const rating = await ShopRating.findById(ratingId)
        if (!rating) {
            return res.status(404).json({ error: 'rating not found' });
        }
        if (!rating.user.equals(user._id) || !rating.shop_rating.equals(shop._id)) {
            return res.status(403).json({ error: 'You are not authorized delete rating' });
        }
        shop.ratings.pull(ratingId);
        await shop.save()
        await ShopRating.findByIdAndDelete(ratingId);

        return res.status(200).json({ success: true, message: "successfully deleted shop rating" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}




module.exports={
    addRating,
    getAllRatingofShop,
    editShopRating,
    deleteShopRating
}