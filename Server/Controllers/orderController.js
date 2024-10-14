const Product = require('../models/productSchema.js');
const User = require('../models/userSchema.js');
const Order = require('../models/orderSchema.js');
const Cart = require('../models/CartSchema.js');
const Payment = require('../models/paymentSchema.js');
const { v4: uuidv4 } = require('uuid'); // for generating transactionId

const placeOrder = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "UserId Not Provided" });
        }
        if (!productId) {
            return res.status(400).json({ success: false, message: "ProductId Not Provided" });
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        // Fetch product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" });
        }

        // Check if user has address
        if (!user.addresses || user.addresses.length === 0) {
            return res.status(401).json({ success: false, message: "Please Add an Address" });
        }

        // Fetch user's cart
        const cart = await Cart.findOne({ userId: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(401).json({ success: false, message: "Please Add Items to the Cart" });
        }

        // Check if the product is in the cart
        const cartItem = cart.items.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(400).json({ success: false, message: "Product Not Found in Cart" });
        }

        // Calculate total price
        const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Step 1: Save payment details
        const { method } = req.body; // Payment method should come in the request body

        const payment = new Payment({
            method: method,
            transactionId: uuidv4(), // Use uuid to generate a unique transaction ID
            status: 'pending', // default status before payment completion
            user: user._id
        });

        // Save the payment to the database
        const savedPayment = await payment.save();

        // Step 2: Create new order after saving payment
        const newOrder = new Order({
            user: user._id,
            items: cart.items,
            totalPrice: totalPrice,
            shippingAddress: user.addresses[0], // Assuming the first address is used for simplicity
            paymentInfo: savedPayment._id, // Link the saved payment to the order
            status: "pending"
        });

        // Save order
        await newOrder.save();

        // Clear cart after order placement
        cart.items = [];
        await cart.save();

        return res.status(201).json({ success: true, message: "Order Placed Successfully", order: newOrder });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// cancel order afterwardds

module.exports = {placeOrder};
