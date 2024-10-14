import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = () => {
  const token = useSelector(state => state.user.token)
  const userId = useSelector(state => state.user.userId)
  const [image, setImage] = useState(null)
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/${userId}/image`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const { userimage } = response.data
        setImage(userimage)
      } catch (error) {
        console.error("Error fetching the image:", error)
      }
    }
    fetchImage()
  }, [userId, token])

  const toggleDisplay = () => {
    setDisplay(!display)
  }

  return (
    <div className='relative'>
      <div className='flex flex-col justify-center items-center gap-5'>
        {/* Profile Image Button */}
        <button onClick={toggleDisplay}>
          <img
            src={image || '/default-profile.png'} // Fallback in case image is null
            alt="#"
            className='w-[40px] h-[40px] rounded-full'
          />
        </button>

        {/* Dropdown Menu */}
        <div className={`absolute right-0 top-[28px] mt-2 w-52 bg-white shadow-lg rounded-md ${display ? 'block' : 'hidden'}`}>
          <div className='flex flex-col items-center gap-2 p-3'>
            {['Account', 'Profile', 'Settings', 'Upgrade to Premium'].map((label, idx) => (
              <Link 
                key={idx} 
                className='hover:bg-amber-400 hover:text-white w-full text-center py-2 rounded-md font-raleway text-sm transition-all'
              >
                {label}
              </Link>
            ))}
            <Link 
              to='/api/logout'
              className='hover:bg-amber-400 hover:text-white w-full text-center py-2 rounded-md font-raleway text-sm transition-all'
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
