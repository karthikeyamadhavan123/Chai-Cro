const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema=new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

const Address=mongoose.model('Address',addressSchema);
module.exports=Address;