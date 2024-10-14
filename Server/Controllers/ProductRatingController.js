const Product = require('../models/productSchema');
const User = require('../models/userSchema');
const ProductRating=require('../models/ProductRatingSchema')
const addProductRating=async(req,res)=>{
    try {
        const { productId, userId } = req.params;
        const { rating } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!rating) {
            return res.status(400).json({ error: 'rating is required and cannot be empty' });
        }

        const product = await Shop.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newProductRating = new ProductRating({
            rating:rating,
            user: userId,
            product: shopId
        });

        await newProductRating.save();

        product.ratings.push(newProductRating._id);
        await product.save();

        return res.status(201).json({ message: 'product Rating created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllRatingofProduct=async(req,res)=>{
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }
        const productRatings = await Product.findById(productId).populate({
            path: 'ratings',
            select: '_id rating'
        })
        if (!productRatings) {
            return res.status(404).json({ error: 'product not found' });
        }
        return res.status(200).json({ success: true, ratings: productRatings })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editProductRating=async(req,res)=>{
    try {
        const { userId, ratingId, productId } = req.params;
        const { editedRating } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!ratingId) {
            return res.status(400).json({ error: 'ratingId is required' });
        }
        if (!productId) {
            return res.status(400).json({ error: 'productId is required' });
        }
        if (!editedRating) {
            return res.status(400).json({ error: 'Rating is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        const rating = await ProductRating.findById(ratingId)
        if (!rating) {
            return res.status(404).json({ error: 'rating not found' });
        }
        if (!rating.user.equals(user._id) || !rating.product.equals(product._id)) {
            return res.status(403).json({ error: 'You are not authorized edit comment' });
        }
        rating.rating = editedRating
        await rating.save()
        return res.status(200).json({ success: true, message: "successfully edited product rating" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteProductRating = async (req, res) => {
    try {
        const { userId, ratingId, productId } = req.params;


        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!ratingId) {
            return res.status(400).json({ error: 'ratingId is required' });
        }
        if (!productId) {
            return res.status(400).json({ error: 'shopId is required' });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'shop not found' });
        }

        const rating = await ProductRating.findById(ratingId)
        if (!rating) {
            return res.status(404).json({ error: 'rating not found' });
        }
        if (!rating.user.equals(user._id) || !rating.product.equals(product._id)) {
            return res.status(403).json({ error: 'You are not authorized delete rating' });
        }
        product.ratings.pull(ratingId);
        await product.save()
        await ProductRating.findByIdAndDelete(ratingId);

        return res.status(200).json({ success: true, message: "successfully deleted product rating" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}




module.exports={
   addProductRating,
   getAllRatingofProduct,
   editProductRating,
   deleteProductRating
}