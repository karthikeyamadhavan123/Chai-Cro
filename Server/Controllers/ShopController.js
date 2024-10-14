const User = require('../models/userSchema');
const Shop = require('../models/ShopSchema');
const cloudinary = require('cloudinary').v2;
<<<<<<< HEAD
const jwt = require('../jwt/jwt.js'); // Make sure this path is correct
const path = require('path');
const Product = require('../models/productSchema.js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose')
const createShop = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).send('Token not found');
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret);

            // Verify the token
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

=======
 // Make sure this path is correct
const path = require('path');
// const Product = require('../models/productSchema.js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose')
const {sendShopCreationEmail}=require('../nodemailer/nodemailer')
const createShop = async (req, res) => {
    try {
>>>>>>> 3e5badb (Your commit message)
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const shop_owner = await User.findById(id);
        if (!shop_owner) {
            return res.status(400).json({ message: "Shop owner not found." });
        }
        if (shop_owner.userType != "admin") {
            return res.status(400).json({ message: "You can't create a shop" });
        }

        const { shop_name, postalCode, shop_address, district } = req.body;

        if (!shop_name) {
            return res.status(400).json({ message: "Shop name is required." });
        }
        if (!postalCode) {
            return res.status(400).json({ message: "Postal code is required." });
        }
        if (!shop_address) {
            return res.status(400).json({ message: "Shop address is required." });
        }
        if (!district) {
            return res.status(400).json({ message: "District is required." });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Shop image is required." });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'shop_images'
        });
<<<<<<< HEAD
        console.log(result);
=======
        
>>>>>>> 3e5badb (Your commit message)
        
        const imageUrl = result.secure_url;

        const newShop = new Shop({
            shop_name,
            postalCode,
            shop_address,
            district,
            shop_owner,
            shop_image: imageUrl
        });

        await newShop.save();
<<<<<<< HEAD
=======
        await sendShopCreationEmail(shop_owner.email,shop_name)
>>>>>>> 3e5badb (Your commit message)

        res.status(201).json({ success: true, msg: "Created Shop Successfully" });
    } catch (err) {
        console.error(err);
<<<<<<< HEAD
        res.status(500).send('Internal Server Error');
    }
}

const createShopProducts = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).send('Token not found');
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret);
            // Verify the token
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        const { id } = req.params;
        const shop = await Shop.findById(id);
        if (!shop) {
            return res.status(400).json({ message: "Shop not present." });
        }
        const shop_userid = shop.shop_owner;


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
        return res.status(201).json({ success: true, message: "Created Product" })

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

const getShops = async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract token from header
    if (!token) {
        return res.status(401).send('Token not found');
    }

    const secret = process.env.SECRET_KEY;
    let decoded;
    try {
        decoded = jwt.verifyToken(token, secret); // Use your custom verifyToken function
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

=======
      return  res.status(500).json({success:false,message:'Shop not created'})
    }
}
const getShops = async (req, res) => {
>>>>>>> 3e5badb (Your commit message)
    try {
        const allShops = await Shop.find({}).populate("shop_owner");
        return res.status(200).json({ success: true, allShops });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

<<<<<<< HEAD
const getShopProducts = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).send('Token not found');
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret); // Use your custom verifyToken function
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
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

const deleteShop = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Token not found');
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret); // Assuming verifyToken is a custom function
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

=======
const deleteShop = async (req, res) => {
    try{
>>>>>>> 3e5badb (Your commit message)
        const { shop_id, userId } = req.params;
        if (!shop_id || !mongoose.Types.ObjectId.isValid(shop_id)) {
            return res.status(400).json({ message: 'Invalid or missing Shop ID' });
        }
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid or missing User ID' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const shopObjectId = new mongoose.Types.ObjectId(shop_id);

        const user = await User.findById(userObjectId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const shop = await Shop.findById(shopObjectId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        if (!shop.shop_owner.equals(user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this shop' });
        }

        const deleteShop = await Shop.findByIdAndDelete(shopObjectId);
        if (!deleteShop) {
            return res.status(500).json({ message: 'Shop could not be deleted due to an error' });
        }

        return res.status(200).json({ message: "Deleted Successfully", success: true });
    } catch (error) {
        console.error(error);
<<<<<<< HEAD
        return res.status(500).send('Internal Server Error');
    }
};

const deleteShopProducts = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Token not found');
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret); // Assuming verifyToken is a custom function
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

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

const editShop = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret); // Assuming jwt.verify from jsonwebtoken
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

=======
        return res.status(500).message({success:false,message:'Some error occured'})
    }
}

const editShop = async (req, res) => {
    try {
>>>>>>> 3e5badb (Your commit message)
        const { shop_id, userId } = req.params;
        const { shop_name, postalCode, shop_address, district } = req.body;
        const image = req.file?.path;

        if (!shop_id || !mongoose.Types.ObjectId.isValid(shop_id)) {
            return res.status(400).json({ message: 'Invalid or missing Shop ID' });
        }
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid or missing userId' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const shopObjectId = new mongoose.Types.ObjectId(shop_id);

        const user = await User.findById(userObjectId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const shop = await Shop.findById(shopObjectId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        if (!shop.shop_owner.equals(user._id)) {
            return res.status(403).json({ message: 'Not authorized to edit this shop' });
        }

        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'shop_image'
            });
            shop.shop_image = result.secure_url || shop.shop_image;
        }

        shop.shop_name = shop_name || shop.shop_name;
        shop.postalCode = postalCode || shop.postalCode;
        shop.shop_address = shop_address || shop.shop_address;
        shop.district = district || shop.district;

        await shop.save();
        return res.status(200).json({ message: "Edited Successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

<<<<<<< HEAD
const editShopProducts = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret); // Assuming jwt.verify from jsonwebtoken
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

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

const getShopDetailsById=async(req,res)=>{
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract token from header
    if (!token) {
        return res.status(401).send('Token not found');
    }

    const secret = process.env.SECRET_KEY;
    let decoded;
    try {
        decoded = jwt.verifyToken(token, secret); // Use your custom verifyToken function
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    try {
        const {shop_id}=req.params;
        if (!shop_id || !mongoose.Types.ObjectId.isValid(shop_id)) {
            return res.status(400).json({ message: 'Invalid or missing Shop ID' });
        }
        
        
        const shop=await Shop.findById(shop_id);
        if(!shop){
            return res.status(404).json({ message: 'Invalid or missing Shop' });
        }
        
     const {shop_name,shop_address,postalCode,district,shop_image}=shop;
        return res.status(200).json({shop_name,shop_address,postalCode,district,shop_image})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getProductDetailsById=async(req,res)=>{
    const authHeader = req.headers['authorization'];


    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract token from header
    if (!token) {
        return res.status(401).send('Token not found');
    }

    const secret = process.env.SECRET_KEY;
    let decoded;
    try {
        decoded = jwt.verifyToken(token, secret); // Use your custom verifyToken function
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    try {
        const {productid}=req.params;
        console.log(productid);
        
        if (!productid || !mongoose.Types.ObjectId.isValid(productid)) {
            return res.status(400).json({ message: 'Invalid or missing product ID' });
        }
        const product=await Product.findById(productid);
        if(!product){
            return res.status(404).send('Product Not Found')
        }
        const { p_name, p_type, price, description, p_image, category } = product;

        // Return the product details as a JSON response
        return res.status(200).json({
          p_name,
          p_type,
          price,
          description,
          p_image,
          category
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}



module.exports = {
    createShop,
    createShopProducts,
    getShops,
    getShopProducts,
    deleteShop,
    deleteShopProducts,
    editShop,
    editShopProducts,
    getShopDetailsById,
    getProductDetailsById
};
=======

module.exports={
    createShop,
    getShops,
    deleteShop,
    editShop
}
>>>>>>> 3e5badb (Your commit message)
