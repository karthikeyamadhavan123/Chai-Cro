import React, { useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ClipLoader } from 'react-spinners';
const ForgotPassword = () => {
  const[email,setEmail]=useState('');
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate();

  const handleChange=(e)=>{
    setEmail(e.target.value)
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const response=await axios.post('http://localhost:8080/api/forgot-password',{email});
     if(response.status===200){
      const{message}=response.data
      toast.success(message)
      navigate('/api/login')
     }
      setEmail('')
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
    finally{
        setLoading(false)
    }

  }
  return (
    <>
     <Helmet>
      <title>Forgot-Password</title>
      <meta name="description" content="Forgot-Password" />
      <meta name="keywords" content="Forgot ,password" />
      </Helmet>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          name='email' value={email} onChange={handleChange}/>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300" disabled={loading}
        >
         {loading?<ClipLoader/>:' Forgot Password'}
        </button>
      </form>
    </div>
  </div>
  <ToastContainer/>
  </>
  )
}

export default ForgotPassword