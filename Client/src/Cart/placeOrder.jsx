import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
const PlaceOrder = () => {
    // State to store cart items
    const [cartItems, setCartItems] = useState([]);
    const userId=useSelector((state)=>state.user.userId)
    const token=useSelector((state)=>state.user.token)

    // State for order details
    const [orderDetails, setOrderDetails] = useState({
        shippingAddress: '',
        paymentMethod: '',
        totalPrice: 0
    });

    // Load cart items on component mount
    useEffect(() => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            const parsedCart = JSON.parse(cart);
            setCartItems(parsedCart);
            
            // Calculate initial total price
            const initialTotal = parsedCart.reduce((total, item) => 
                total + (item.product.price * item.quantity), 0);
            
            setOrderDetails(prev => ({
                ...prev,
                totalPrice: initialTotal
            }));
        }
    }, []);

    // Handle shipping address input
    const handleAddressChange = (e) => {
        setOrderDetails(prev => ({
            ...prev,
            shippingAddress: e.target.value
        }));
    };

    // Handle payment method selection
    const handlePaymentMethodChange = (e) => {
        setOrderDetails(prev => ({
            ...prev,
            paymentMethod: e.target.value
        }));
    };

    // Place order handler
    const handlePlaceOrder = () => {
        // Validate order
        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }

        if (!orderDetails.shippingAddress) {
            alert('Please enter shipping address');
            return;
        }

        if (!orderDetails.paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        // Prepare order payload
        const orderPayload = {
            items: cartItems,
            ...orderDetails
        };

        console.log('Order Payload:', orderPayload);
    };

    const placeOrder = async()=>{
        const arraycart=[cartItems.map((cart)=>cart.product.p_name)]
        try {
            const res=await axios.post(`http://localhost:8080/order/${userId}/place`,{arraycart},{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            console.log(res);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Place Order</h1>

            {/* Cart Items */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
                    {cartItems.map(item => (
                        <div 
                            key={item._id} 
                            className="flex items-center p-2 border mb-2"
                        >
                            {item.product.p_image && (
                                <img 
                                    src={item.product.p_image} 
                                    alt={item.product.p_name} 
                                    className="w-16 h-16 object-cover mr-4" 
                                />
                            )}
                            <div>
                                <p className="font-medium">{item.product.p_name}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ₹{item.product.price}</p>
                                <p>Type: {item.product.p_type}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Details */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Order Details</h2>
                    
                    {/* Shipping Address */}
                    <div className="mb-4">
                        <label className="block mb-2">Shipping Address</label>
                        <textarea 
                            value={orderDetails.shippingAddress}
                            onChange={handleAddressChange}
                            className="w-full border p-2"
                            placeholder="Enter shipping address"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="block mb-2">Payment Method</label>
                        <select 
                            value={orderDetails.paymentMethod}
                            onChange={handlePaymentMethodChange}
                            className="w-full border p-2"
                        >
                            <option value="">Select Payment Method</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="upi">UPI</option>
                            <option value="cod">Cash on Delivery</option>
                        </select>
                    </div>

                    {/* Order Summary */}
                    <div className="border p-4">
                        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                        <p>Total Items: {cartItems.length}</p>
                        <p>Total Price: ₹{orderDetails.totalPrice.toFixed(2)}</p>
                        
                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-blue-500 text-white p-2 mt-4 
                                       hover:bg-blue-600 transition-colors
                                       disabled:bg-gray-300"
                            disabled={cartItems.length === 0}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceOrder;