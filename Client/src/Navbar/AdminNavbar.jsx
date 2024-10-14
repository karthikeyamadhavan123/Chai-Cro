import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getUser from '../Profile/Profile';

const AdminNavbar = () => {
    const [image, setImage] = useState(null);
    useEffect(() => {
        async function fetchUserImage() {
            try {
                const userImage = await getUser();
                setImage(userImage);
            } catch (error) {
                console.error('Error fetching user image:', error);
                // Set a default image or handle the error as needed
            }
        }

        fetchUserImage();
    }, []);
    return (
        <div className="bg-gradient-to-r from-Coral to-TangerineOrange py-4">
            <div className="flex justify-between items-center w-full max-w-6xl mx-auto px-4">
                {/* Left: ChaiCro Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <img src="" alt="logo" className="w-10 h-10 mr-2" />
                        <h1 className="font-raleway font-bold text-xl text-white hidden lg:block">
                            CHAICRO
                        </h1>
                    </Link>
                </div>

                {/* Center: Search Box */}
                <div className="flex-grow flex justify-center">
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            {/* Search Icon */}
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>

                            {/* Input Field */}
                            <input
                                type="text"
                                placeholder="Search for shops and products"
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            type="button"
                            className="ml-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Right: Empty space to maintain center alignment */}
                <div className="flex items-center w-10">
                    <img
                        src={image} // Replace with your profile image URL
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-white"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;
