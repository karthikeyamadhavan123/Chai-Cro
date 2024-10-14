import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const EditShopForm = () => {
  const { shopId } = useParams();
  const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
  const parsedAuth = auth ? JSON.parse(auth) : null;
  const token = parsedAuth?.token;
  const userId = parsedAuth?.userId
  const navigate = useNavigate()
  const [shopDetails, setShopDetails] = useState({
    shop_name: '',
    shop_address: "",
    postalCode: "",
    shop_image: "",
    district: ""
  })
  useEffect(() => {
    const fetchShopdetails = async () => {
      const result = await axios.get(`http://localhost:8080/shop/${shopId}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }

      })
      const { shop_name, shop_address, postalCode, shop_image, district } = result.data
      setShopDetails({
        shop_name,
        shop_address,
        shop_image,
        postalCode,
        district
      })

    }
    fetchShopdetails();
  }, [shopId, userId, token])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));


  }

  const handleImageChange = (e) => {
    setShopDetails((prevDetails) => ({
      ...prevDetails,
      shop_image: e.target.files[0]
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('shop_name', shopDetails.shop_name);
    form.append('postalCode', shopDetails.postalCode);
    form.append('shop_address', shopDetails.shop_address);
    form.append('district', shopDetails.district);
    form.append('shop_image', shopDetails.shop_image);
    try {
      const result = await axios.put(`http://localhost:8080/shop/${userId}/${shopId}/edit`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      const { status } = result
      if (status === 200) {
        navigate('/shop')
      }

    } catch (error) {
      console.log(error);
      console.error('There was an error creating the shop!', error);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500">
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Edit Shop Details</h2>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Shop Name:</label>
          <input
            type="text"
            name="shop_name"
            value={shopDetails.shop_name}
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
            value={shopDetails.postalCode}
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
            value={shopDetails.shop_address}
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
            value={shopDetails.district}
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
          Edit Shop Details
        </button>
      </form>
    </div>
  )
}

export default EditShopForm
