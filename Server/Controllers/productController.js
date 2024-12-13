
const Shop = require('../models/ShopSchema');
const cloudinary = require('cloudinary').v2; // Make sure this path is correct
const path = require('path');
const Product = require('../models/productSchema.js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose')
const {sendProductCreationEmail}=require('../nodemailer/nodemailer');
const User = require('../models/userSchema.js');
const createProducts = async (req, res) => {
    try {
        const { id } = req.params; // shop id
        const shop = await Shop.findById(id);
        if (!shop) {
            return res.status(400).json({ message: "Shop not present." });
        }
        const shop_userid = shop.shop_owner;
        const user=await User.findOne({_id:shop_userid});
        


        const { p_name, p_type, price, stock, description, category } = req.body;
        if (!p_name) {
            return res.status(400).json({ message: "Product name is required." });
        }

        if (!p_type) {
            return res.status(400).json({ message: "Product type is required." });
        }

        if (!price) {
            return res.status(400).json({ message: "Price is required." });
        }

        if (!stock) {
            return res.status(400).json({ message: "Stock is required." });
        }

        if (!description) {
            return res.status(400).json({ message: "Description is required." });
        }

        if (!category) {
            return res.status(400).json({ message: "Category is required." });
        }




        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Product Image is required." });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'product_images'
        }); // the key value should match  multer type like product_image
        const imageUrl = result.secure_url;
        const newProduct = new Product({
            p_name,
            p_type,
            price,
            description,
            stock,
            category,
            owner: shop_userid,
            p_image: imageUrl,
            shop
        })
        await newProduct.save();
        shop.shop_products.push(newProduct._id);
        await shop.save();
        await sendProductCreationEmail(user.email,p_name)
        return res.status(201).json({ success: true, message: "Created Product" })

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}

const getShopProducts = async (req, res) => {
    try {
        const { shop_id } = req.params;
        const shop = await Shop.findById(shop_id);
        const shop_name=shop.shop_name;
        if (!shop) {
            return res.status(401).json({ message: 'Shop Not Found' });
        }
        const Products = await shop.populate('shop_products');
        if (Products.length === 0) {
            return res.status(401).json({ message: 'Product Not Present please add ' });
        }
        return res.status(200).json({ success: true, Products,shop_name })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

const deleteProducts = async (req, res) => {
    try {
        const { shop_id, productId } = req.params;
        if (!shop_id || !mongoose.Types.ObjectId.isValid(shop_id)) {
            return res.status(400).json({ message: 'Invalid or missing Shop ID' });
        }
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid or missing productId' });
        }

        const ProductObjectId = new mongoose.Types.ObjectId(productId);
        const shopObjectId = new mongoose.Types.ObjectId(shop_id);

        const product = await Product.findById(ProductObjectId);
        if (!product) {
            return res.status(404).json({ message: 'User not found' });
        }

        const shop = await Shop.findById(shopObjectId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        if (!shop.shop_owner.equals(product.owner)) {
            return res.status(403).json({ message: 'Not authorized to delete this shop' });
        }
        shop.shop_products.pull(productId);
        await shop.save();

        const deleteproduct = await Product.findByIdAndDelete(productId);
        if (!deleteproduct) {
            return res.status(500).json({ message: 'Product could not be deleted due to an error' });
        }

        return res.status(200).json({ message: "Deleted Successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};
const editShopProducts = async (req, res) => {
    try {
        const { shop_id, productId } = req.params;
        const { p_name, p_type, price, description, stock, category } = req.body;
        const image = req.file?.path;

        if (!shop_id || !mongoose.Types.ObjectId.isValid(shop_id)) {
            return res.status(400).json({ message: 'Invalid or missing Shop ID' });
        }
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid or missing userId' });
        }

        const productObjectId = new mongoose.Types.ObjectId(productId);
        const shopObjectId = new mongoose.Types.ObjectId(shop_id);

        const product = await Product.findById(productObjectId);
        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }

        const shop = await Shop.findById(shopObjectId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        if (!shop.shop_owner.equals(product.owner)) {
            return res.status(403).json({ message: 'Not authorized to edit this shop' });
        }

        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'product_image'
            });
            product.product_image = result.secure_url ||  product.product_image;
        }

        product.p_name = p_name || product.p_name;
        product.p_type = p_type || product.p_type;
        product.price = price || product.price
        product.category = category || product.category
        product.description = description || product.description
        product.stock = stock || product.stock

        await product.save();
        return res.status(200).json({ message: "product edited Successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
const getProductInformation=async(req,res) => {
try {
    const { productId } = req.params;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
        
    }
    const product = await Product.findById(productId)
            .select('p_name p_image description stock category price') // Product fields
            .populate({
                path: 'comments',
                select: 'comment', // Select specific fields from comments if needed
            })
            .populate({
                path: 'ratings',
                select: 'rating', // Select specific fields from ratings if needed
            });

       
    if (!product) {
        return res.status(404).json({ message: 'product not found' });
    }
    
    return res.status(200).json({product})
} catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });

    
}
}
module.exports={
    createProducts,
    getShopProducts,
    deleteProducts,
    editShopProducts,
    getProductInformation
}