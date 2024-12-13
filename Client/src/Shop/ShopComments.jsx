import useComments from '@/hooks/useComments';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams,Link } from 'react-router-dom';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const ShopComments = () => {
  const nav = useNavigate();
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userId);
  const { shopId } = useParams();
  const url = `http://localhost:8080/shop-comment/${shopId}/all`;
  const [shopsCommentsLoaded, setShopsCommentsLoaded] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { comments, loading, error, setComments } = useComments(url, token);

  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch shop comments details.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && comments.length > 0 && !shopsCommentsLoaded) {
      toast.success('Shop Comments loaded successfully!', {
        position: 'top-right',
      });
      setShopsCommentsLoaded(true);
    }
  }, [error, loading, comments, shopsCommentsLoaded, nav]);

  // Handle Edit button click
  const handleEdit = (commentId, commentContent) => {
    setEditCommentId(commentId);
    setEditedComment(commentContent);
    setIsModalOpen(true); // Open the modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditCommentId(null);
    setEditedComment('');
  };

  // Submit the updated comment using Axios
  const handleEditSubmit = async () => {
    // Check if the current user is the author of the comment before making the optimistic update

  
    // Proceed with optimistic update
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === editCommentId ? { ...comment, comment: editedComment } : comment
      )
    );
    handleCloseModal(); // Close the modal immediately after the optimistic update
  
    try {
      const response = await axios.put(
        `http://localhost:8080/shop-comment/${userId}/${shopId}/${editCommentId}/edit`,
        { editedComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success(response.data.message || 'Comment edited successfully!');
        // No need to update again as optimistic update already reflected
      } else {
        throw new Error(response.data.error || 'Failed to edit comment');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error(error.response?.data?.message || 'Failed to edit comment. Please try again.');
  
      // Optionally: Revert the optimistic update in case of error
      setComments((prevComments) => prevComments.map((comment) =>
        comment._id === editCommentId ? { ...comment, comment: commentToEdit.comment } : comment
      ));
    }
  };
  

  // Handle Delete using Axios
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/shop-comment/${userId}/${shopId}/${commentId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the comments in the UI
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || 'Failed to delete comment.'}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>All Comments | Chaicro</title>
        <meta name='description' content='Shop Comments' />
        <meta name='keywords' content='ChaiCro, Shop Comments' />
      </Helmet>

      <div className='w-full bg-gradient-to-r from-Coral to-TangerineOrange p-6 font-Playfair pl-5 min-h-screen'>
        <h2 className='text-2xl font-semibold mb-4 font-Playfair text-white'>Comments</h2>

        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className='flex'>
          <p className='text-white'>No comments available for this shop.</p>
          <Link to='/shop' className='text-white hover:text-black'>Back To Shop</Link>
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className='w-64 h-auto bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'
              >
                <div className='flex items-start mb-2'>
                  {/* User Profile Image */}
                  <img
                    src={comment.user.image}
                    alt={`${comment.user.username}'s profile`}
                    className='w-10 h-10 rounded-full mr-3'
                  />

                  {/* User Comment Content */}
                  <div className='flex-1'>
                    <p className='font-bold text-sm text-black'>{comment.user.username}</p>
                    <p className='text-gray-700 text-xs'>{comment.comment}</p>
                  </div>
                </div>

                {/* Edit and Delete Buttons */}
                <div className='flex justify-end space-x-2 mt-2'>
                
                  {
                    comment.user._id===userId ?<><button
                    onClick={() => handleEdit(comment._id, comment.comment)}
                    className='text-xs text-blue-600 hover:underline'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className='text-xs text-red-600 hover:underline'
                  >
                    Delete
                  </button>
                  </>:''
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Editing Comment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Comment</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
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

export default ShopComments;
