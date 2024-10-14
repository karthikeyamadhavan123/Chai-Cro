import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateShop = () => {
  const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
  const parsedAuth = auth ? JSON.parse(auth) : null;
  const token = parsedAuth?.token;
  const id = parsedAuth?.userId
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    shop_name: '',
    postalCode: '',
    shop_address: '',
    district: '',
    shop_image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      shop_image: e.target.files[0],
    });
  };

  const createNewShop = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('shop_name', formData.shop_name);
    form.append('postalCode', formData.postalCode);
    form.append('shop_address', formData.shop_address);
    form.append('district', formData.district);
    form.append('shop_image', formData.shop_image);

    try {
    const result= await axios.post(`http://localhost:8080/shop/new/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
        },
        timeout: 10000
      });
      console.log(result);
      
     
      
      const {status}=result
      if(status===201){
        navigate('/shop')
      }
      setFormData({
        shop_name:'',
        shop_address:"",
        postalCode:"",
        district:"",
        shop_image:null
      })
    } catch (error) {
      console.error('There was an error creating the shop!', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500">
      <form onSubmit={createNewShop} className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Create New Shop</h2>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Shop Name:</label>
          <input
            type="text"
            name="shop_name"
            value={formData.shop_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Shop Address:</label>
          <input
            type="text"
            name="shop_address"
            value={formData.shop_address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">District:</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>



        <div className="mb-6">
          <label className="block text-blue-700 font-medium mb-2">Shop Image:</label>
          <input
            type="file"
            name="shop_image"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
          Create Shop
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
