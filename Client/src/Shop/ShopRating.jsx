import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import useRatings from '@/hooks/useRatings';

const ShopRatings = () => {
  const nav = useNavigate();
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userId);
  const { shopId } = useParams();
  const url = `http://localhost:8080/shop-rating/${shopId}/all`;
  const [ratingsLoaded, setRatingsLoaded] = useState(false);
  const [editRatingId, setEditRatingId] = useState(null);
  const [editedRating, setEditedRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {  ratings, loading, error,  setratings } = useRatings(url, token);

  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }

    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch shop ratings.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && ratings.length > 0 && !ratingsLoaded) {
      toast.success('Shop Ratings loaded successfully!', {
        position: 'top-right',
      });
      setRatingsLoaded(true);
    }
  }, [error, loading, ratings, ratingsLoaded, nav]);

  // Handle Edit button click
  const handleEdit = (ratingId, ratingValue) => {
    setEditRatingId(ratingId);
    setEditedRating(ratingValue);
    setIsModalOpen(true); // Open the modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditRatingId(null);
    setEditedRating(0);
  };

  // Submit the updated rating using Axios
  const handleEditSubmit = async () => {
    // Optimistically update the rating in the UI before sending the request
    setratings((prevRatings) =>
      prevRatings.map((rating) =>
        rating._id === editRatingId ? { ...rating, rating: editedRating } : rating
      )
    );
    handleCloseModal(); // Close the modal immediately after the optimistic update

    try {
      const response = await axios.put(
        `http://localhost:8080/shop-rating/${userId}/${shopId}/${editRatingId}/edit`,
        { editedRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Rating edited successfully!');
      } else {
        throw new Error(response.data || 'Failed to edit rating');
      }
    } catch (error) {
      toast.error(`Error: ${error.message || 'Failed to edit rating.'}`);
      // Revert the optimistic update
      setratings((prevRatings) =>
        prevRatings.map((rating) =>
          rating._id === editRatingId ? { ...rating, rating: rating.rating } : rating
        )
      );
    }
  };

  // Handle Delete using Axios
  const handleDelete = async (ratingId) => {
    try {
      await axios.delete(`http://localhost:8080/shop-rating/${userId}/${shopId}/${ratingId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the ratings in the UI
      setratings((prevRatings) => prevRatings.filter((rating) => rating._id !== ratingId));
      toast.success('Rating deleted successfully!');
    } catch (error) {
      toast.error(`Error: ${error.message || 'Failed to delete rating.'}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>All Ratings | Chaicro</title>
        <meta name="description" content="Shop Ratings" />
        <meta name="keywords" content="ChaiCro, Shop Ratings" />
      </Helmet>

      <div className="w-full bg-gradient-to-r from-Coral to-TangerineOrange p-6 font-Playfair pl-5 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-white">Ratings</h2>

        {loading ? (
          <p>Loading ratings...</p>
        ) : ratings.length === 0 ? (
          <div className="flex">
            <p className="text-white">No ratings available for this shop.</p>
            <Link to="/shop" className="text-white hover:text-black">Back To Shop</Link>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {ratings.map((rating) => (
              <div
                key={rating._id}
                className="w-64 h-auto bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-start mb-2">
                  {/* User Profile Image */}
                  <img
                    src={rating.user.image}
                    alt={`${rating.user.username}'s profile`}
                    className="w-10 h-10 rounded-full mr-3"
                  />

                  {/* User Rating Content */}
                  <div className="flex-1">
                    <p className="font-bold text-sm text-black">{rating.user.username}</p>
                    <p className="text-gray-700 text-xs">Rating: {rating.rating} / 5</p>
                  </div>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="flex justify-end space-x-2 mt-2">
                  {
                    rating.user._id === userId ? <><button
                    onClick={() => handleEdit(rating._id, rating.rating)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rating._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button></> : ''
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Editing Rating */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Rating</h3>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={editedRating}
              onChange={(e) => setEditedRating(Number(e.target.value))}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleEditSubmit}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={handleCloseModal}
                className="text-sm bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default ShopRatings;
