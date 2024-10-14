const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema=new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
<<<<<<< HEAD
=======
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
>>>>>>> 3e5badb (Your commit message)
})

const Address=mongoose.model('Address',addressSchema);
module.exports=Address;