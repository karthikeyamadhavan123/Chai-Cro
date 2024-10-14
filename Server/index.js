const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT;
<<<<<<< HEAD
const registerRoutes = require('./routes/UserRoute');
const shopRoutes=require('./Routes/Shoproute')
const CartRoutes=require('./Routes/CartRoute')
=======
const registerRoutes = require('./Routes/userroute');
const shopRoutes=require('./Routes/shopRoute')
const productRoutes=require('./Routes/productRoute')
const cartRoutes=require('./Routes/cartRoute')
const AddressRoutes=require('./Routes/addressRoute')
const ShopCommentRoutes=require('./Routes/ShopCommentRoute')
const ShopRatingRoutes=require('./Routes/ShopRatingRoute')
const ProductCommentRoutes=require('./Routes/ProductCommentRoute')
const ProductRatingRoutes=require('./Routes/ProductRatingRoute')
const OrderRoutes=require('./Routes/orderRoute')
>>>>>>> 3e5badb (Your commit message)
main().catch(err => console.log(err));
const cors = require('cors')
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database Connected');

}

//MIDDLEWARES


// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(cors());


// Import and use your routes

app.use('/api', registerRoutes);
app.use('/shop',shopRoutes)
<<<<<<< HEAD
app.use('/cart',CartRoutes)
=======
app.use('/shop-products',productRoutes)
app.use('/cart',cartRoutes)
app.use('/address',AddressRoutes)
app.use('/shop-comment',ShopCommentRoutes)
app.use('/shop-rating',ShopRatingRoutes)
app.use('/product-comment',ProductCommentRoutes)
app.use('/product-rating',ProductRatingRoutes)
app.use('/order',OrderRoutes)
>>>>>>> 3e5badb (Your commit message)



app.listen(port, () => {
    console.log(`Server Running on ${port}`);

})