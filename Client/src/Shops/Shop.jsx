import React, { useEffect, useState } from 'react';
import Footer from '../Components/Footer';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import getAdminStatus from '../Admin/Admin';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavbar from '../Navbar/AdminNavbar';
const Shop = () => {
    const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
    const parsedAuth = auth ? JSON.parse(auth) : null;
    const token = parsedAuth?.token;
    const userId=parsedAuth?.userId
    const [isAdmin, setIsAdmin] = useState(false);
    const [shops, setShops] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        // Function to check if the session has expired
        const checkSessionExpiry = () => {
            const loginTime = localStorage.getItem('loginitem') || localStorage.getItem("registerTime");
        
            if (loginTime) {
                const loginTimeMs = Number(loginTime); // Convert login time to a number
                const expiryTime = loginTimeMs + 2 * 60 * 60 * 1000; // Add 2 hours (in milliseconds) to the login time
                const currentTime = new Date().getTime();
        
                if (currentTime >= expiryTime) { // Check if the current time is greater than or equal to the expiry time
                    localStorage.clear();
                    toast('Session expired. Please log in again.');
                    console.log('Redirecting to login page'); // Debug statement
                    nav('/api/login');
                }
            }
        }   

        // Run the session check on component mount
        checkSessionExpiry();

        const fetchShops = async () => {
            try {
                const response = await axios.get('http://localhost:8080/shop/allShops', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

               

                setShops(response.data.allShops);
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };

        const checkAdmin = () => {
            const adminStatus = getAdminStatus();
            setIsAdmin(adminStatus); // Update state with admin status
        };

        fetchShops();
        checkAdmin();
    }, [token, nav]);

    const handleNavigate = () => {
        nav('/shop/new');
    };

    const handleEdit = (shopId) => {
        if (isAdmin) {
            nav(`/shop/${shopId}/edit`);
        } else {
            alert('You do not have permission to edit this shop.');
        }
    };

    const handleDelete = async (shopId) => {
        if (isAdmin) {
            try {
                await axios.delete(`http://localhost:8080/shop/${userId}/${shopId}/delete`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                setShops(shops.filter(shop => shop._id !== shopId));
                alert('Shop deleted successfully.');
            } catch (error) {
                console.error('Error deleting shop:', error);
                alert('Failed to delete the shop.');
            }
        } else {
            alert('You do not have permission to delete this shop.');
        }
    };

    return (
        <>
            <Helmet>
                <title>All Shops | Chaicro</title>
                <meta name="description" content="Shop" />
                <meta name="keywords" content="ChaiCro, Shop" />
            </Helmet>
            <div className='w-screen min-h-screen bg-gradient-to-r from-Coral to-TangerineOrange'>
                <AdminNavbar />
                <section className="p-8">
                    <div className="grid grid-cols-1 gap-8 font-Playfair">
                        {shops.map((shop) => (
                            <div key={shop._id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                                <div className="w-1/3 pr-4">
                                    <img src={shop.shop_image} alt={shop.shop_name} className="object-cover w-full h-full" />
                                </div>
                                <div className="p-4 w-full  flex flex-col justify-center">
                                    <Link className="text-lg font-semibold mb-2 hover:text-TangerineOrange hover:underline hover:ease-out" to={`/shop/${shop._id}/products`}>{shop.shop_name}</Link>
                                    <p className="text-gray-600 mb-1"><strong>Address:</strong> {shop.shop_address}</p>
                                    <p className="text-gray-600 mb-1"><strong>Postal Code:</strong> {shop.postalCode}</p>
                                    <p className="text-gray-600 mb-1"><strong>District:</strong> {shop.district}</p>
                                    {isAdmin && (
                                        <>
                                        <div className='flex gap-5'>
                                        <button onClick={() => handleEdit(shop._id)} className='bg-green-300  mb-2 h-10 w-20 rounded-full hover:text-white hover:ease-out hover:bg-green-400'>Edit</button>
                                        <button onClick={() => handleDelete(shop._id)} className='bg-red-500 h-10 w-20 rounded-full hover:text-white hover:ease-out hover:bg-red-400'>Delete</button>
                                        </div>
                                           
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {isAdmin && (
                        <button
                            onClick={handleNavigate}
                            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create Your New Store
                        </button>
                    )}
                </section>
                <Footer />
            </div>
            <ToastContainer/>
            
        </>
    );
};

export default Shop;
