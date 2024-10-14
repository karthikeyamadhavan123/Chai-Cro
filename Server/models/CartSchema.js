const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0 // calculated based on the items in the cart
    },
<<<<<<< HEAD
=======
    totalQuantity:{
        type: Number,
        required: true,
        default: 0 
    }
>>>>>>> 3e5badb (Your commit message)
   
}, { timestamps: true }); // automatically adds createdAt and updatedAt

const Cart = mongoose.model('Cart', CartSchema);
<<<<<<< HEAD
module.exports = Cart;
=======
module.exports = Cart;
>>>>>>> 3e5badb (Your commit message)
