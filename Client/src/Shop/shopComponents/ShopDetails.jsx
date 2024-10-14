import useFetch from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShopHovering from '../ShopHovering';
import { Helmet } from 'react-helmet-async';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import axios from 'axios';

const ShopDetails = () => {
  const token = useSelector((state) => state.user.token);
  const admin = useSelector((state) => state.user.userType);
  const userId = useSelector((state) => state.user.userId)
  const url = `http://localhost:8080/shop/allShops`;
  const { shop, loading, error, setShop } = useFetch(url, token);
  const [hoveredShop, sethoveredShop] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shopsLoaded, setShopsLoaded] = useState(false);
  const [editedShop, setEditedShop] = useState(null)
  const [commentShop, setCommentShop] = useState(null)
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0);
  const [ratingShop, setratingShop] = useState(null)
  const nav = useNavigate();

  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch shop details.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && shop.length > 0 && !shopsLoaded) {
      toast.success('Shops loaded successfully!', {
        position: 'top-right',
      });
      setShopsLoaded(true);
    }
  }, [error, loading, shop, shopsLoaded, nav]);

  const handleNavigation = () => {
    nav('/shop/new');
  };

  const handleMouseEnter = (shop, e) => {
    sethoveredShop(shop);
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    sethoveredShop(null);
  };

  const handleDeletion = async (shopId) => {
    try {
      // Make DELETE request to delete the shop
      await axios.delete(`http://localhost:8080/shop/${userId}/${shopId}/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the shop state by filtering out the deleted shop
      setShop(prevShops => prevShops.filter(singleShop => singleShop._id !== shopId));

      // Reset hovered shop state
      sethoveredShop(null);

    } catch (error) {
      // Log the error and display it using a toast notification
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (shop) => {
    setEditedShop(shop)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Add shop details to FormData
      formData.append('shop_name', editedShop.shop_name);
      formData.append('shop_address', editedShop.shop_address);
      formData.append('postalCode', editedShop.postalCode);
      formData.append('district', editedShop.district);

      // Add the image file to FormData
      if (editedShop.shop_image instanceof File) {
        formData.append('shop_image', editedShop.shop_image);
      }

      // Send a PUT request to update the shop details
      await axios.put(`http://localhost:8080/shop/${userId}/${editedShop._id}/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setShop((prevShops) =>
        prevShops.map((shop) =>
          shop._id === editedShop._id ? { ...shop, ...editedShop } : shop
        )
      );
      // Show success notification
      toast.success('Shop updated successfully!');

      // Clear the editedShop state after submission
      setEditedShop(null);
    } catch (error) {
      console.error('Error updating shop:', error);
      toast.error('Failed to update shop.');
    }
  };

  const handleadd = (shop) => {
    setCommentShop(shop)
  }

  const handleratingadd = (shop) => {
    setratingShop(shop)
  }

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/shop-comment/${userId}/${commentShop._id}/add`, { comment }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.status === 201) {
        setComment(null)
        setCommentShop(null)
        toast.success('Comment Created Successfully')
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to add Comment')

    }
  }
  const addRating = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/shop-rating/${userId}/${ratingShop._id}/add`, { rating }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.status === 201) {
        setRating(null)
        setratingShop(null)
        toast.success('Rating Created Successfully')
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to add Rating')

    }
  }

  const handleNavComment=(shopId)=>{
    nav(`/shop/${shopId}/comments`)
  }
  const handleNavRating=(shopId)=>{
    nav(`/shop/${shopId}/ratings`)
  }

  
  return (
    <div className='flex flex-col min-h-screen'>
      <Helmet>
        <title>All Shops | Chaicro</title>
        <meta name='description' content='Shop' />
        <meta name='keywords' content='ChaiCro, Shop' />
      </Helmet>

      {/* Grid container for shops */}
      <div className='flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4'>
        {/* Show loading spinner when data is being fetched */}
        {loading && <ClipLoader color='#ffffff' loading={loading} size={20} />}

        {/* Show error message if there's an error */}
        {!loading && error && (
          <div className='text-red-500 text-lg font-semibold mt-4'>
            Oops! Something went wrong: {error.message || 'Failed to fetch shop details.'}
          </div>
        )}

        {/* Shop details */}
        {!loading &&
          !error &&
          shop.map((shop) => (
            <div
              className='bg-[#2C2A35] rounded-lg shadow-lg overflow-hidden w-[70%] flex flex-col cursor-pointer font-lora min-h-full relative'
              key={shop._id}
            >
              <img src={shop.shop_image} alt={shop.shop_name} className='object-cover w-full h-80' onMouseEnter={(e) => handleMouseEnter(shop, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave} />

              <div className='p-4'>
                <Link to={`/shop/${shop._id}/products`} className='text-white font-semibold text-lg hover:underline'>
                  {shop.shop_name}
                </Link>
                <p className='text-gray-400 text-sm'>
                  <strong>Address:</strong> {shop.shop_address}
                </p>
                <p className='text-gray-400 text-sm'>
                  <strong>Postal Code:</strong> {shop.postalCode}
                </p>
                <p className='text-gray-400 text-sm'>
                  <strong>District:</strong> {shop.district}
                </p>
                {admin === 'admin' ?
                  <div className='flex gap-5 mt-4'>
                    <button className='bg-green-300 mb-2 h-10 w-20 rounded-full hover:text-white hover:ease-out hover:bg-green-400' onClick={() => handleEdit(shop)}>
                      Edit
                    </button>
                    <button className='bg-red-500 h-10 w-20 rounded-full hover:text-white hover:ease-out hover:bg-red-400' onClick={() => handleDeletion(shop._id)}>
                      Delete
                    </button>
                  </div> :
                  <div className='flex flex-col gap-3'>
                    <div className='flex gap-5 mt-4'>
                      <button className='bg-cyan-400 mb-2 h-10 w-32 rounded-full hover:text-white hover:ease-out hover:bg-cyan-300' onClick={() => handleadd(shop)}>
                        Add Comment
                      </button>
                      <button className='bg-indigo-400 h-10 w-32 rounded-full hover:text-white hover:ease-out hover:bg-indigo-500' onClick={() => handleratingadd(shop)}>
                        Add Rating
                      </button>
                    </div>
                    <div className='flex gap-5 mt-4'>
                      <button className='bg-amber-300 mb-2 h-10 w-40 rounded-full hover:text-white hover:ease-out hover:bg-amber-400' onClick={() => handleNavComment(shop._id)}>
                        View Comments
                      </button>
                      <button className='bg-fuchsia-200 h-10 w-32 rounded-full hover:text-white hover:ease-out hover:bg-fuchsia-300' onClick={() => handleNavRating(shop._id)}>
                        View Ratings
                      </button>
                    </div>

                  </div>}
              </div>
            </div>
          ))}
      </div>

      {/* Separate ShopHovering component outside the map function */}
      {hoveredShop && (
        <div
          className='absolute z-10 transition-opacity duration-700 opacity-100'
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y + 20}px`,
          }}
        >
          <ShopHovering
            name={hoveredShop.shop_name}
            district={hoveredShop.district}
            code={hoveredShop.postalCode}
            address={hoveredShop.shop_address}
          />
        </div>
      )}

      {/* "Create your Shop" button */}
      {admin === 'admin' && (
        <div className='mt-auto p-4 flex justify-center'>
          <button
            className='bg-white w-40 h-10 rounded-lg font-raleway hover:bg-amber-300 hover:transition-colors hover:ease-in-out hover:text-white'
            onClick={handleNavigation}
          >
            Create your Shop
          </button>
        </div>
      )}

      {editedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out font-Playfair">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 transform transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Edit Shop: {editedShop.shop_name}</h2>

            {/* Form to edit shop details */}
            <form onSubmit={handleEditSubmit} className="space-y-4">

              {/* Shop Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="shopName">Shop Name</label>
                <input
                  type="text"
                  id="shopName"
                  className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={editedShop.shop_name}
                  onChange={(e) => setEditedShop({ ...editedShop, shop_name: e.target.value })}
                  required
                />
              </div>

              {/* Shop Address */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="shopAddress">Shop Address</label>
                <input
                  type="text"
                  id="shopAddress"
                  className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={editedShop.shop_address}
                  onChange={(e) => setEditedShop({ ...editedShop, shop_address: e.target.value })}
                  required
                />
              </div>

              {/* Postal Code */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={editedShop.postalCode}
                  onChange={(e) => setEditedShop({ ...editedShop, postalCode: e.target.value })}
                  required
                />
              </div>

              {/* District */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="district">District</label>
                <input
                  type="text"
                  id="district"
                  className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={editedShop.district}
                  onChange={(e) => setEditedShop({ ...editedShop, district: e.target.value })}
                  required
                />
              </div>

              {/* Shop Image */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="shopImage">Shop Image URL</label>
                <input
                  type="file"
                  id="shopImage"
                  className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setEditedShop({ ...editedShop, shop_image: e.target.files[0] })} // Store the File object

                />
              </div>


              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                {/* Cancel button */}
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                  onClick={() => setEditedShop(null)}
                >
                  Cancel
                </button>

                {/* Save button */}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {
        commentShop && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out font-Playfair">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 transform transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Add Comment Shop: {commentShop.shop_name}</h2>

            {/* Form to edit shop details */}
            <form className="space-y-4" onSubmit={(e) => addComment(e)}>

              {/* Shop Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="shopName">Comment</label>
                <input
                  type="text"

                  className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={comment || " "}
                  onChange={(e) => setComment(e.target.value)}
                  name='comment'
                // required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">

                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                  onClick={() => setCommentShop(null)}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>)
      }

      {
        ratingShop && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out font-Playfair">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 transform transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Add Rating Shop: {ratingShop.shop_name}</h2>

            {/* Form to edit shop details */}
            <form className="space-y-4" onSubmit={(e) => addRating(e)}>

            
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="shopName">Rating</label>
                <input
                  type="number"

                  className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={rating || 0}
                  onChange={(e) => setRating(e.target.value)}
                  name='rating'
                  max={5}
                  min={1}
                required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">

                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                  onClick={() => setratingShop(null)}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>)
      }
      <ToastContainer />
    </div>
  );
};

export default ShopDetails;