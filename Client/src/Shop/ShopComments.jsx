import useComments from '@/hooks/useComments';
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
const ShopComments = () => {
  const nav = useNavigate()
  const token = useSelector((state) => state.user.token);
  const { shopId } = useParams()
  const url = `http://localhost:8080/shop-comment/${shopId}/all`;
  const [shopsCommentsLoaded, setShopsCommentsLoaded] = useState(false);
  const { comments, loading, error, setComments } = useComments(url, token)
  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch shop  comments details.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && comments.length > 0 && !shopsCommentsLoaded) {
      toast.success('Shop Comments loaded successfully!', {
        position: 'top-right',
      });
      setShopsCommentsLoaded(true)
    }
  }, [error, loading, comments, shopsCommentsLoaded, nav]);
  return (
    <>
      <Helmet>
        <title>All Comments | Chaicro</title>
        <meta name='description' content='Shop Comments' />
        <meta name='keywords' content='ChaiCro, Shop Comments' />
      </Helmet>

      <div className='w-full  bg-gradient-to-r from-Coral to-TangerineOrange p-6  font-Playfair pl-5 min-h-screen'>
        <h2 className='text-2xl font-semibold mb-4 font-Playfair text-white'>Comments</h2>

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
                  <p className='text-xs text-gray-500 mt-1'>{comment.timeAgo || "2 hours ago"}</p>
                </div>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(comment._id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <ToastContainer />
      {/* later insert search bars */}
    </>
  )
}

export default ShopComments
