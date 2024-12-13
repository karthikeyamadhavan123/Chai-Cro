import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import useProductComment from '@/hooks/useProductComment';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import axios from 'axios'; // Removed unnecessary 'preview' import

const ProductComment = () => {
  const { productId } = useParams();
  const nav = useNavigate();
  const token = useSelector((state) => state.user.token);
  const url = `http://localhost:8080/product-comment/${productId}/all`;

  const [ProductCommentsLoaded, setProductCommentsLoaded] = useState(false);
  const { comments, loading, error, setComments } = useProductComment(url, token); // Ensure setComments is returned by the hook
  const [editingCommentId, setEditingCommentId] = useState(null); 
  const [editedCommentText, setEditedCommentText] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch product comments.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && comments.length > 0 && !ProductCommentsLoaded) {
      toast.success('Product comments loaded successfully!', {
        position: 'top-right',
      });
      setProductCommentsLoaded(true);
    }
  }, [error, loading, comments, ProductCommentsLoaded, nav]);

  // Function to handle delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/product-comment/${userId}/${productId}/${commentId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Comment deleted successfully!', {
        position: 'top-right',
      });
      const updatedComments = comments.filter((comment) => comment._id !== commentId);
      setComments(updatedComments);
    } catch (err) {
      toast.error(`Error: ${err.message || 'Failed to delete comment.'}`, {
        position: 'top-right',
      });
    }
  };

  // Function to handle entering edit mode (opens modal)
  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditedCommentText(comment.comment);
    setIsModalOpen(true); // Open the modal
  };

  // Function to handle saving the edited comment
  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8080/product-comment/${userId}/${productId}/${editingCommentId}/edit`,
        { editedCommentText }, // Send comment key instead of editedCommentText
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Comment updated successfully!', {
        position: 'top-right',
      });

      // Update comments in the local state
      const updatedComments = comments.map((comment) =>
        comment._id === editingCommentId
          ? { ...comment, comment: editedCommentText } // Update the comment text
          : comment
      );
      setComments(updatedComments); // Update the comments in the state

      setIsModalOpen(false); // Close the modal after saving
      setEditingCommentId(null); // Clear the editing state
    } catch (err) {
      toast.error(`Error: ${err.message || 'Failed to update comment.'}`, {
        position: 'top-right',
      });
    }
  };

  
  return (
    <>
      <Helmet>
        <title>Product Comments</title>
        <meta name="description" content="Product comments for ChaiCro." />
        <meta name="keywords" content="ChaiCro, Product Comments" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-r from-Coral to-TangerineOrange p-5 font-lora text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-semibold mb-5 text-white">Product Comments</h1>

          {/* Loading state with ClipLoader */}
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          ) : (
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-white p-3 rounded shadow-md max-w-xs w-full flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      {/* User Image */}
                      <img
                        src={comment.user?.image || 'https://via.placeholder.com/40'}
                        alt={comment.user?.username || 'Anonymous'}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      {/* Username */}
                      <h2 className="font-semibold text-sm">{comment.user?.username || 'Anonymous'}</h2>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-800 text-sm mb-2">{comment.comment}</p>

                    {/* Edit & Delete Buttons */}
                    {comment.user._id === userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(comment)}
                          className="text-blue-500 hover:underline text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No comments available for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />

      {/* Modal for editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
            
            {/* Textarea for editing comment */}
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={editedCommentText}
              onChange={(e) => setEditedCommentText(e.target.value)}
              rows="4"
              placeholder="Edit your comment..."
            />

            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductComment;
