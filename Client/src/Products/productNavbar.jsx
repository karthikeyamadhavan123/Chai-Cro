import Profile from '@/Profile/Profile'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'


const ProductNavbar = ({quantity}) => {
    
    
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
                        placeholder="Search for Products"
                        className="w-full p-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-white text-sm font-lora"
                        aria-label="Search"
                    />
                </div>

                {/* Navigation Actions */}
                <div className="flex items-center space-x-4 gap-3">
                    {/* Cart Button */}
                    <Link 
                        to="/cart" 
                        className="relative text-white hover:text-gray-300 transition-colors duration-200"
                        aria-label="Shopping Cart"
                    >
                        <ShoppingCart size={24} />
                        {/* Optional: Cart Item Count Badge */}
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {quantity>0?quantity:0}
                        </span>
                    </Link>

                    {/* Profile Component */}
                    <Profile />
                </div>
            </nav>
        </header>
    )
}

export default ProductNavbar