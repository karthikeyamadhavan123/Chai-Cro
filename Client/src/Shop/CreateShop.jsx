import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import { ClipLoader } from 'react-spinners';
const CreateShop = () => {
    const userId = useSelector((state) => state.user.userId)
    const token = useSelector((state) => state.user.token)
    const [loading, setLoading] = useState(false)
    const navigation = useNavigate()
    const [shopDetails, setShopDetails] = useState({
        shop_name: '',
        postalCode: '',
        shop_address: '',
        district: '',
        shop_image: null,
    });
    useEffect(() => {
        const check = checkSessionExpiry();
        if (check) {
            nav('/api/login');
            return;
        }
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShopDetails({
            ...shopDetails,
            [name]: value,
        });
    }


    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true)
            const formdata = new FormData();
            formdata.append('shop_name', shopDetails.shop_name)
            formdata.append('postalCode', shopDetails.postalCode)
            formdata.append('shop_address', shopDetails.shop_address)
            formdata.append('district', shopDetails.district)
            formdata.append('shop_image', shopDetails.shop_image)
            const response = await axios.post(`http://localhost:8080/shop/new/${userId}`, formdata, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 201) {

                setShopDetails({
                    shop_name: '',
                    shop_address: '',
                    shop_image: null,
                    district: '',
                    postalCode: ''
                })
                navigation('/shop')
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target
        setShopDetails({
            ...shopDetails,
            [name]: files[0]
        })
    }

    return (
        <>
            <Helmet>
                <title>Create a new Shop | Chaicro</title>
                <meta name="description" content="Shop" />
                <meta name="keywords" content="ChaiCro, Shop new" />
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-yellow-500 font-raleway">
                <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg border border-orange-300">
                    <h2 className="text-3xl font-bold text-orange-600 mb-4 text-center tracking-wide">
                        Register Shop
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="shop_name">
                                Shop Name
                            </label>
                            <input
                                id="shop_name"
                                name="shop_name"
                                type="text"
                                value={shopDetails.shop_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                placeholder="Enter Shop Name"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="postalCode">
                                Postal Code
                            </label>
                            <input
                                id="postalCode"
                                name="postalCode"
                                type="text"
                                value={shopDetails.postalCode}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                placeholder="Enter Postal Code"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="shop_address">
                                Shop Address
                            </label>
                            <input
                                id="shop_address"
                                name="shop_address"
                                type="text"
                                value={shopDetails.shop_address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                placeholder="Enter Shop Address"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="district">
                                District
                            </label>
                            <input
                                id="district"
                                name="district"
                                type="text"
                                value={shopDetails.district}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                placeholder="Enter District"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-orange-700 text-sm font-semibold mb-1" htmlFor="shop_image">
                                Shop Image URL
                            </label>
                            <input
                                id="shop_image"
                                name="shop_image"
                                type="file" // Change the input type to file
                                onChange={handleFileChange} // Handle file change
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold text-sm flex justify-center items-center"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <ClipLoader color="#ffffff" loading={loading} size={20} />
                            ) : (
                                "Register Shop"
                            )}
                        </button>

                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default CreateShop;
