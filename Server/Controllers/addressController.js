const Address = require('../models/addressSchema');
const User = require('../models/userSchema')
const mongoose = require('mongoose')

const addAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { street, city, state, postalCode, country } = req.body;
        if (!userId) {
            return res.status(401).send('userId not present');
        }
        if (!street) {
            return res.status(401).send('Street  should be present');
        }
        if (!city) {
            return res.status(401).send('city  should be present');
        }
        if (!state) {
            return res.status(401).send('state  should be present');
        }
        if (!postalCode) {
            return res.status(401).send('Street  should be present');
        }
        if (!country) {
            return res.status(401).send('country  should be present');
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).send('User not present');
        }

        const newAddress = new Address({
            street: street,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country
        })

        await newAddress.save();
        user.addresses.push(newAddress._id);
        await user.save()
        return res.status(201).json({ success: true, message: "Address created successfully" });


    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error')

    }
}

const getAddress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(401).send('userId not present');
        }
        const user = await User.findById(userId).select('addresses').populate({path:'addresses',
            select:'street city postalCode country state'
        })

        if (!user) {
            return res.status(401).send('User not present');
        }


        return res.status(201).json({ success: true, addresses: user });


    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error')

    }
}

const EditAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
      
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid userId format');
        }
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).send('Invalid addressId format');
        }

        if (!userId) {
            return res.status(400).send('userId not present');
        }
        if (!addressId) {
            return res.status(400).send('addressId not present');
        }
       

     
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

       
        const existingAddress = await Address.findById(addressId);
        if (!existingAddress) {
            return res.status(404).send('Address not found');
        }

        // Destructure fields from request body
        const { street, city, postalCode, state, country } = req.body;

     
        if (!street && !city && !postalCode && !state && !country) {
            return res.status(400).send('Please provide at least one parameter to edit');
        }

     
        if (street) existingAddress.street = street;
        if (city) existingAddress.city = city;
        if (postalCode) existingAddress.postalCode = postalCode;
        if (state) existingAddress.state = state;
        if (country) existingAddress.country = country;

       
        await existingAddress.save();

        
        return res.status(200).json({ message: 'Address edited successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};


const deleteAddress=async(req,res)=>{
    try {
        const { userId, addressId } = req.params;
        
        if (!userId) {
            return res.status(400).send('userId not present');
        }
        if (!addressId) {
            return res.status(400).send('addressId not present');
        }

     
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

       
        const existingAddress = await Address.findById(addressId);
        if (!existingAddress) {
            return res.status(404).send('Address not found');
        }
        user.addresses.pull(existingAddress._id);
        await user.save()
        await existingAddress.deleteOne({_id:addressId});

        
        return res.status(200).json({ message: 'Address Deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    addAddress,
    getAddress,
    EditAddress,
    deleteAddress
}