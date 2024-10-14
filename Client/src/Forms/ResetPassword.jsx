import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import { ClipLoader } from 'react-spinners';

const ResetPassword = () => {
  const [details, setDetails] = useState({
    password: '',
    newpassword: ''
  })
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate()
  const { token } = useParams();
  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails(details => ({
      ...details,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
setLoading(true)
    try {
      if(details.password!==details.newpassword){
        toast.error('Please Check Your Passwords')
       return; 
      }
      const response = await axios.post(`http://localhost:8080/api/reset-password/${token}`, { password: details.password });
     
      if (response.status === 200) {
        const {message}=response.data
     
        toast.success(message)
        navigate('/api/login')
      }
      setDetails({
        password: '',
        newpassword: ''
      })

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }

  }
  return (
    <>
     <Helmet>
      <title>Reset-Password</title>
        <meta name="description" content="Reset-Password" />
        <meta name="keywords" content="Reset ,password" />
      </Helmet>
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name='password' value={details.password} onChange={handleChange} />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name='newpassword' value={details.newpassword} onChange={handleChange}/>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}>
             {loading?<ClipLoader color="#ffffff" loading={loading} size={20}/>:'Reset Password'} 
            </button>
          </form>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  )
}

export default ResetPassword;