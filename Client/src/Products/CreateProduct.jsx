import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import { ClipLoader } from 'react-spinners';
const CreateShop = () => {
  // const userId = useSelector((state) => state.user.userId)
  const { id } = useParams()

  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const navigation = useNavigate()
  const [productDetails, setproductDetails] = useState({
    p_name: '',
    p_type: '',
    price: '',
    description: '',
    stock: '',
    category: '',
    product_image: null
  });
  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setproductDetails({
      ...productDetails,
      [name]: value,
    });
  }


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      const formdata = new FormData();
      formdata.append('p_name', productDetails.p_name)
      formdata.append('p_type', productDetails.p_type)
      formdata.append('price', productDetails.price)
      formdata.append('description', productDetails.description)
      formdata.append('stock', productDetails.stock)
      formdata.append('category', productDetails.category)
      formdata.append('product_image', productDetails.product_image)
      const response = await axios.post(`http://localhost:8080/shop-products/${id}/newproducts`, formdata, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })


      if (response.status === 201) {
        setproductDetails({
          p_name: '',
          p_type: '',
          price: '',
          description: '',
          stock: '',
          category: '',
          product_image: null
        })
        navigation(`/shop/${id}/products`)
      }


    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
    finally {
      setLoading(false)
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target
    setproductDetails({
      ...productDetails,
      [name]: files[0]
    })
  }

  return (
    <>
      <Helmet>
        <title>Create a new Product | Chaicro</title>
        <meta name="description" content="Product" />
        <meta name="keywords" content="ChaiCro, Product new" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-yellow-500 font-Playfair">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg border border-orange-300">
          <h2 className="text-3xl font-bold text-orange-600 mb-4 text-center tracking-wide">
            Register Product
          </h2>
          <form onSubmit={handleSubmit} >
            <div className="mb-3">
              <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="shop_name">
                Product Name
              </label>
              <input
                id="p_name"
                name="p_name"
                type="text"
                value={productDetails.p_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                placeholder="Enter Product Name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="postalCode">
                Product Type
              </label>
              <input
                id="p_type"
                name="p_type"
                type="text"
                value={productDetails.p_type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                placeholder="Enter Product Type"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="shop_address">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="text"
                value={productDetails.price}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                placeholder="Enter Product Price"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="district">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={productDetails.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                placeholder="Enter Product Description"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="district">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="text"
                value={productDetails.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                placeholder="Enter Product Stock"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="district">
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={productDetails.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                placeholder="Enter Product Category"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="shop_image">
                Product Image URL
              </label>
              <input
                id="product_image"
                name="product_image"
                type="file" // Change the input type to file
                onChange={handleFileChange} // Handle file change
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                required
              />
            </div>
            {loading ? (
              <button className=' bg-orange-500 w-full h-10'><ClipLoader color="#ffffff" loading={loading} size={20} /></button>
            ) : (
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold text-sm"
              >
                Register product
              </button>
            )}

          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateShop;
