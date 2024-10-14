import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/style.css'

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navigateFunction = (path) => {
        navigate(path);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    return (
        <nav className='flex justify-between items-center p-4 w-full'>
            <Link to='/' className='flex items-center'>
                <img src="" alt="#" className='w-10 h-10 mr-2' />
                <h1 className="font-raleway font-bold text-3xl text-white hidden  lg-md:block sm-ma:text-xl sm-ma:hidden sm-ma1:block sm-ma1:text-xl">
                    CHAICRO
                </h1>
            </Link>

            {/* Desktop Menu */}
            <div className='hidden sm-md:flex items-center gap-4 font-lora'>

                <NavLink to='/'>Home</NavLink>

                <NavLink to='/about'>About</NavLink>
                <NavLink to='/vendors'>Vendors</NavLink>
                <NavLink to='/contact'>Contact Us</NavLink>
            </div>

            {/* Mobile Menu Icon */}
            <div className='md:hidden'>
                <button onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <FaTimes className='text-white' size={24} /> : <FaBars className='text-white' size={24} />} {/* checking is mobile is true or not*/}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='md:hidden absolute top-16 left-0 w-full bg-gradient-to-r from-Coral to-TangerineOrange p-4 flex flex-col space-y-4 text-center font-lora'>
                    <NavLink to='/' onClick={toggleMobileMenu} className=' bg-slate-50 w-full h-8 rounded-full mt-4' >Home</NavLink>
                    <NavLink to='/about' onClick={toggleMobileMenu} className=' bg-slate-50 w-full h-8 rounded-full mt-4' >About</NavLink>
                    <NavLink to='/shop' onClick={toggleMobileMenu} className=' bg-slate-50 w-full h-8 rounded-full mt-4' >Shop</NavLink>
                    <NavLink to='/vendors' onClick={toggleMobileMenu} className=' bg-slate-50 w-full h-8 rounded-full mt-4' >Vendors</NavLink>
                    <NavLink to='/contact' onClick={toggleMobileMenu} className=' bg-slate-50 w-full h-8 rounded-full mt-4' >Contact Us</NavLink>
                 <button className=' bg-slate-50 w-full h-8 rounded-full mt-4' onClick={() => { navigateFunction('/api/register'); toggleMobileMenu(); }}>Sign-In</button>
                    <button className=' bg-slate-50 w-full h-8 rounded-full' onClick={() => { navigateFunction('/api/login'); toggleMobileMenu(); }}>Login</button>
                    
                </div>
            )}

            {/* Sign-In and Login Buttons (Desktop) */}
           <div className='hidden md:flex md:gap-3 pr-2 gap-10 font-lora'>
                <button className='font-bold bg-slate-50 w-20 h-8 rounded-full' onClick={() => navigateFunction('/api/register')}>
                    Sign-In
                </button>
                <button className='font-bold bg-slate-50 w-20 h-8 rounded-full' onClick={() => navigateFunction('/api/login')}>Login</button>
            </div>
        </nav>
    );
};

export default Navbar;