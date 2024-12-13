const Product = require('../models/productSchema.js');
const User = require('../models/userSchema.js');
const Order = require('../models/orderSchema.js');
const Cart = require('../models/CartSchema.js');
const Payment = require('../models/paymentSchema.js');
const { v4: uuidv4 } = require('uuid'); // for generating transactionId

const placeOrder = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productNames } = req.body; // Array of product names

        if (!userId) {
            return res.status(400).json({ success: false, message: "UserId Not Provided" });
        }
        if (!productNames || !Array.isArray(productNames) || productNames.length === 0) {
            return res.status(400).json({ success: false, message: "Product Names Not Provided" });
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        // Check if user has address
        if (!user.addresses || user.addresses.length === 0) {
            return res.status(401).json({ success: false, message: "Please Add an Address" });
        }

        // Fetch user's cart
        const cart = await Cart.findOne({ userId: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(401).json({ success: false, message: "Please Add Items to the Cart" });
        }

        // Validate all requested products are in the cart by name
        const invalidProducts = productNames.filter(productName => 
            !cart.items.some(item => item.product.name === productName)
        );

        if (invalidProducts.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Some Products Not Found in Cart",
                missingProducts: invalidProducts 
            });
        }

        // Filter cart items to only include requested products
        const orderedItems = cart.items.filter(item => 
            productNames.includes(item.product.name)
        );

        // Calculate total price for ordered items
        const totalPrice = orderedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Save payment details
        const { method } = req.body; // Payment method should come in the request body

        const payment = new Payment({
            method: method,
            transactionId: uuidv4(),
            status: 'pending',
            user: user._id
        });

        // Save the payment to the database
        const savedPayment = await payment.save();

        // Create new order with selected products
        const newOrder = new Order({
            user: user._id,
            items: orderedItems,
            totalPrice: totalPrice,
            shippingAddress: user.addresses[0], // Assuming the first address is used for simplicity
            paymentInfo: savedPayment._id,
            status: "pending"
        });

        // Save order
        await newOrder.save();

        // Set cart to empty array
        cart.items = [];
        await cart.save();

        return res.status(201).json({ 
            success: true, 
            message: "Order Placed Successfully", 
            order: newOrder 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

module.exports = {placeOrder};
