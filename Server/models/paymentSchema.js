const mongoose = require('mongoose');
const { Schema } = mongoose;
const paymentSchema = new Schema({
    method: { type: String, required: true }, // e.g., 'credit card', 'paypal'
    transactionId: { type: String }, // optional transaction ID from the payment gateway  // use uuid4  
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    user: {

        type: Schema.Types.ObjectId,
        ref: "User",
        required: true

    }
})

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
