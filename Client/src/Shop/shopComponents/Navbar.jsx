import Profile from '@/Profile/Profile'
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <header className='h-16 px-4'>
            <nav className='flex justify-between items-center h-full'>
                {/* Logo and Title */}
                <Link to='/' className='flex items-center'>
                    <img 
                        src="" 
                        alt="#" 
                        className='w-10 h-10 mr-2' 
                        aria-label="Chaicro Home" 
                    />
                    <h1 className="font-raleway font-bold text-3xl text-white hidden lg:block sm:text-xl">
                        CHAICRO
                    </h1>
                </Link>

                {/* Search Bar (reduced size) */}
                <div className="relative w-2/3 h-2/3 mx-4 hidden md:flex">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search for Shops or Products"
                        className="w-full p-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-white text-sm font-lora"
                        aria-label="Search"
                    />
                </div>

                {/* Profile Component */}
                <div className="flex items-center">
                    <Profile />
                </div>
            </nav>
        </header>
    )
}

export default Navbar
