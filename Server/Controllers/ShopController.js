const User = require('../models/userSchema');
const Shop = require('../models/ShopSchema');
const cloudinary = require('cloudinary').v2;
 // Make sure this path is correct
const path = require('path');
// const Product = require('../models/productSchema.js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose')
const {sendShopCreationEmail}=require('../nodemailer/nodemailer')
const createShop = async (req, res) => {
    try {
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
        await sendShopCreationEmail(shop_owner.email,shop_name)

        res.status(201).json({ success: true, msg: "Created Shop Successfully" });
    } catch (err) {
        console.error(err);
      return  res.status(500).json({success:false,message:'Shop not created'})
    }
}
const getShops = async (req, res) => {
    try {
        const allShops = await Shop.find({}).populate("shop_owner");
        return res.status(200).json({ success: true, allShops });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

const deleteShop = async (req, res) => {
    try{
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
        return res.status(500).message({success:false,message:'Some error occured'})
    }
}

const editShop = async (req, res) => {
    try {
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


module.exports={
    createShop,
    getShops,
    deleteShop,
    editShop
}
