import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import useProductRating from '@/hooks/useProductRating';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader
import axios from 'axios'; // For making API calls

const ProductRating = () => {
  const { productId } = useParams();
  const nav = useNavigate();
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userId);
  const url = `http://localhost:8080/product-rating/${productId}/all`;
  const [ProductRatingLoaded, setProductRatingLoaded] = useState(false);
  const { ratings, loading, error,setratings } = useProductRating(url, token);
  const [editingRatingId, setEditingRatingId] = useState(null); // Track which rating is being edited
  const [editedRating, setEditedRating] = useState(''); // Store edited rating value
  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal visibility

  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch product ratings details.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && ratings.length > 0 && !ProductRatingLoaded) {
      toast.success('Product Ratings loaded successfully!', {
        position: 'top-right',
      });
      setProductRatingLoaded(true);
    }
  }, [error, loading, ratings, ProductRatingLoaded, nav]);

  // Function to handle delete rating
  const handleDelete = async (ratingId) => {
    try {
      await axios.delete(`http://localhost:8080/product-rating/${userId}/${productId}/${ratingId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Rating deleted successfully!', {
        position: 'top-right',
      });
      setratings(ratings.filter((rating)=>rating._id !==ratingId))
    } catch (err) {
      toast.error(`Error: ${err.message || 'Failed to delete rating.'}`, {
        position: 'top-right',
      });
    }
  };

  // Function to handle entering edit mode
  const handleEditClick = (rating) => {
    setEditingRatingId(rating._id); // Set the rating ID that is being edited
    setEditedRating(rating.rating); // Set the current rating value in the editable input
    setIsModalOpen(true); // Open the modal
  };

  // Function to handle saving the edited rating
  const handleSaveEdit = async (ratingId) => {
    try {
      await axios.put(
        `http://localhost:8080/product-rating/${userId}/${productId}/${ratingId}/edit`,
        { editedRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Rating updated successfully!', {
        position: 'top-right',
      });

      const updatedRatings=ratings.map((rating)=>rating._id===editingRatingId ? {...rating,rating:editedRating}:rating)
      setratings(updatedRatings)
      setEditingRatingId(null); // Exit edit mode after saving
      setIsModalOpen(false); // Close the modal
    } catch (err) {
      toast.error(`Error: ${err.message || 'Failed to update rating.'}`, {
        position: 'top-right',
      });
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingRatingId(null); // Exit edit mode without saving
    setEditedRating(''); // Clear the edited text
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      <Helmet>
        <title>Products Ratings</title>
        <meta name="description" content="Products" />
        <meta name="keywords" content="ChaiCro, Products Ratings" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-r from-Coral to-TangerineOrange p-5 font-Playfair">
        <div className="container mx-auto">
          <h1 className="text-2xl font-semibold mb-5 text-white ">Product Ratings</h1>

          {/* Loading state with ClipLoader */}
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.length > 0 ? (
                ratings.map((rating) => (
                  <div key={rating._id} className="bg-white p-3 rounded shadow-md max-w-xs w-full flex flex-col items-start">
                    <div className="flex gap-4 items-center mb-2">
                      {/* User Image */}
                      <img
                        src={rating.user?.image || 'https://via.placeholder.com/40'}
                        alt={rating.user?.username || 'Anonymous'}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      {/* Username */}
                      <h2 className="font-semibold text-sm">{rating.user?.username || 'Anonymous'}</h2>
                    </div>

                    {/* Rating */}
                    <p className="text-gray-800 text-sm mb-2">Rating: {rating.rating}/5</p>

                    {/* Edit & Delete Buttons */}
                    {rating.user._id === userId && (
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditClick(rating)} className="text-blue-500 hover:underline text-xs">Edit</button>
                        <button onClick={() => handleDelete(rating._id)} className="text-red-500 hover:underline text-xs">Delete</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className='text-white'>No ratings available for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for editing rating */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Rating</h2>
            <input
              type="number"
              value={editedRating}
              onChange={(e) => setEditedRating(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Enter new rating"
              min="1"
              max="5"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingRatingId)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default ProductRating;
