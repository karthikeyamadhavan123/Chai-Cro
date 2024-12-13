import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCart from '@/hooks/useCart';
import axios from 'axios';
import { FaPlus, FaMinus } from 'react-icons/fa';
import ProductNavbar from '@/Products/productNavbar';
import Buy from './Buy';

const Cart = () => {
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userId);
  const url = `http://localhost:8080/cart/${userId}/cart-items`;
  const nav = useNavigate();
  const [cartLoaded, setCartLoaded] = useState(false);
  const { cart, loading, error, price, quantity, mutate } = useCart(url, token);

  // State to manage local cart updates
  const [localCart, setLocalCart] = useState([]);
  const [localPrice, setLocalPrice] = useState(price);
  const [localQuantity, setLocalQuantity] = useState(quantity);

  // Update local cart when cart from useCart changes
  useEffect(() => {
    if (cart) {
      setLocalCart(cart);
      setLocalPrice(price);
      setLocalQuantity(quantity);
    }
  }, [cart, price, quantity]);

  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch cart items details.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && cart.length > 0 && !cartLoaded) {
      toast.success('Cart items loaded successfully!', {
        position: 'top-right',
      });
      setCartLoaded(true);
    }
  }, [error, loading, cart, cartLoaded, nav]);

  // Loading state with ClipLoader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader
          color="#ffffff"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  const addToCart = async (productId) => {
    try {
      // Find the product to get its price
      const productToAdd = localCart.find(item => item.product._id.toString() === productId);
      
      // Optimistic update
      const updatedCart = localCart.map(item => {
        if (item.product._id.toString() === productId) {
          return {
            ...item,
            quantity: (item.quantity || 0) + 1
          };
        }
        return item;
      });

      // Calculate new price and quantity
      const newQuantity = localQuantity + 1;
      const newPrice = localPrice + (productToAdd ? productToAdd.product.price : 0);

      // Update local state immediately
      setLocalCart(updatedCart);
      setLocalQuantity(newQuantity);
      setLocalPrice(newPrice);
      
      // Make the API call
       await axios.post(`http://localhost:8080/cart/${userId}/${productId}/add`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

     

      toast.success('Item added to cart!', {
        position: 'top-right',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item to cart', {
        position: 'top-right',
      });
      
      // Revert local state if API call fails
      setLocalCart(cart);
      setLocalQuantity(quantity);
      setLocalPrice(price);
    }
  }

  const removeFromCart = async (productId) => {
    try {
      // Find the product to get its price
      const productToRemove = localCart.find(item => item.product._id.toString() === productId);
      
      // Optimistic update
      const updatedCart = localCart.map(item => {
        if (item.product._id.toString() === productId) {
          return {
            ...item,
            quantity: Math.max((item.quantity || 0) - 1, 0)
          };
        }
        return item;
      }).filter(item => item.quantity > 0);

      // Calculate new price and quantity
      const newQuantity = Math.max(localQuantity - 1, 0);
      const newPrice = localPrice - (productToRemove ? productToRemove.product.price : 0);

      // Update local state immediately
      setLocalCart(updatedCart);
      setLocalQuantity(newQuantity);
      setLocalPrice(newPrice);
      
      // Make the API call
      await axios.delete(`http://localhost:8080/cart/${userId}/${productId}/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

     

      toast.success('Item removed from cart!', {
        position: 'top-right',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove item from cart', {
        position: 'top-right',
      });
      
      // Revert local state if API call fails
      setLocalCart(cart);
      setLocalQuantity(quantity);
      setLocalPrice(price);
    }
  }


  return (
    <div className='min-h-screen bg-gradient-to-r from-Coral to-TangerineOrange'>
      <ProductNavbar quantity={localQuantity}/>
      <div className=" text-black">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-4xl font-bold mb-6 text-white">Your Cart</h1>
          {localCart && localCart.length > 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              {localCart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center space-x-4" key={item._id}>
                    <img
                      src={item.product.p_image}
                      alt={item.product.p_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.product.p_name}
                      </h3>
                      <p className="text-gray-500">₹{item.product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => addToCart(item.product._id.toString())}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
                    >
                      <FaPlus />
                    </button>
                    <span className="text-lg font-medium">
                      {item.quantity || 0}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product._id.toString())}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                    >
                      <FaMinus />
                    </button>
                  </div>
                  <p className="text-lg font-semibold">
                    ₹{item.product.price * (item.quantity || 0)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">
                  Total Quantity: {localQuantity}
                </p>
                <p className="text-2xl font-bold">₹{localPrice}</p>
              </div>
            </div>
          ) : (
            <p className="text-xl text-center">Your cart is empty.</p>
          )}
        </div>
      </div>
     <Buy localPrice={localPrice} cart={localCart}/>
      <ToastContainer />
    </div>
  );
};

export default Cart;