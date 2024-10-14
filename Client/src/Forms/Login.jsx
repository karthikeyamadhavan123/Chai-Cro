import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import {loginUser as loginUserAction} from "@/redux/slice"
const Login = () => {
const dispatch=useDispatch();
  const [loading, setLoading] = useState(false) // we dont login at first
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    email: '',
    password: ''
  })
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
      const response = await axios.post('http://localhost:8080/api/login', {
        email: details.email,
        password: details.password
      })
      if (response.status === 201) {

        const { username, token,usertype,userId } = response.data
        dispatch(loginUserAction({
          username,
          token,
          usertype,
          userId
        }))
        
        const LoginTime = new Date().getTime();
        
        localStorage.setItem('loginitem',LoginTime);
        setDetails({
          email: '',
          password: ''
        })
        navigate('/shop')
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.message) {
        toast.error(error.message)  // Specific error from server
      } else {
        toast.error("An unexpected error occurred. Please try again.");  // Fallback error message
      }
    }
    finally {
      setLoading(false)
    }

  }

  return (
    <>
      <Helmet>
        <title>Login | Login To ChaiCro</title>
        <meta name="description" content="Login for MyApp and join our community." />
        <meta name="keywords" content="Login" />
      </Helmet>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-custom-dark-blue z-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}


      {
        !loading && (<div className="min-h-screen flex items-center justify-center font-henny relative z-50 bg-background bg-no-repeat bg-cover">
          <div className="h-screen bg-black absolute z-0 inset-0 opacity-30"></div>
          <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg bg-login bg-center bg-cover relative">

            {/* Apply a semi-transparent overlay to the form */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg"></div>

            <h2 className="text-2xl font-bold text-center text-white relative z-10">Login to Dolly Chai Wala</h2>
            <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>

              {/* Email and Password Fields */}
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="input-class w-full p-3 border border-gray-300 rounded bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name='email' value={details.email} onChange={handleChange} />
                <input
                  type="password"
                  placeholder="Password"
                  className="input-class w-full p-3 border border-gray-300 rounded bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name='password' value={details.password} onChange={handleChange} />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between mt-6">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox text-blue-500" />
                  <span className="ml-2 text-white">Remember me</span>
                </label>
                <Link to="/api/forgot-password" className="text-sm text-blue-400 hover:underline">Forgot password?</Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login to Chaicro
              </button>
            </form>

            {/* Redirect to Sign Up */}
            <p className="text-center text-sm text-gray-300 mt-4 relative z-10">
              Don't have an account? <Link to="/api/register" className="text-blue-400 hover:underline">Sign up here</Link>
            </p>
          </div>
        </div>)
      }
      <ToastContainer />
    </>
  );
};
export default Login;