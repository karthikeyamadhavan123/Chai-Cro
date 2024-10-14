import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux'
import { registerUser as registerUserAction } from "@/redux/slice";
import { ClipLoader } from 'react-spinners';
const Register = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false) // intially we are not loading any data from backend so it false
  const navigate = useNavigate()
  const [registerUser, setRegisterUser] = useState({
    username: "",
    email: "",
    image: null,
    password: "",
    userType: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files.length > 0) {
      setRegisterUser(prevState => ({
        ...prevState,
        [name]: files[0],
      }));
    }
     else {
      setRegisterUser(prevState => ({
        ...prevState,
        [name]: value, // Handle text inputs
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true) // here posting happens hence we set to true
    const formData = new FormData();
    formData.append("username", registerUser.username);
    formData.append("email", registerUser.email);
    formData.append("password", registerUser.password);
    formData.append("userType", registerUser.userType);

    if (registerUser.image) {
      formData.append("image", registerUser.image);
    }
    

    try {
      const response = await axios.post("http://localhost:8080/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      console.log("Response received:", response.data);
      if (response.status === 201) {

        const { username, token, userType, userId } = response.data;
        dispatch(registerUserAction({
          username,
          token,
          userType,
          userId
        }));


        const registerTime = new Date().getTime();
        localStorage.setItem('registerTime', registerTime)

        navigate('/shop')

      }
      setRegisterUser({
        username: "",
        email: "",
        image: null,
        password: "",
        userType: ""
      })


    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.message)
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Welcome To ChaiCro</title>
        <meta name="description" content="Register for MyApp and join our community." />
        <meta name="keywords" content="register, sign up, MyApp" />
      </Helmet>

      <div className="relative z-50 bg-background bg-no-repeat bg-cover">
        <div className="h-screen bg-black absolute z-0 inset-0 opacity-30"></div>
        <div className="min-h-screen flex items-center justify-center font-henny">
          <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg bg-dolly bg-center bg-cover relative">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg"></div>
            <h2 className="text-2xl font-bold text-center text-white relative z-10">
              Sign Up for ChaiCro
            </h2>
            <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {registerUser.image ? (
                    <img
                      src={URL.createObjectURL(registerUser.image)}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-500">Image</span>
                  )}
                </div>
                <label className="block text-gray-600 mt-2">
                  <input
                    type="file"
                    name="image"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <span className="text-sm cursor-pointer text-blue-500 hover:underline">
                    Upload Profile Picture
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="input-class w-full p-3 border border-gray-300 rounded bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="username"
                  value={registerUser.username}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input-class w-full p-3 border border-gray-300 rounded bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  value={registerUser.email}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input-class w-full p-3 border border-gray-300 rounded bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="password"
                  value={registerUser.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    className="form-radio text-blue-500"
                    checked={registerUser.userType === "user"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-white">User</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    className="form-radio text-blue-500"
                    checked={registerUser.userType === "admin"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-white">Admin</span>
                </label>
              </div>

               <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading} >
                {loading ? <ClipLoader  color="#ffffff" loading={loading} size={20}/>:'Register to Chaicro'}
              </button> 
              
            </form>

            <p className="text-center text-sm text-gray-300 mt-4 relative z-10">
              Already have an account?{" "}
              <Link to="/api/login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;