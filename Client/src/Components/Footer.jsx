
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className='w-fullbg-gradient-to-r from-Coral to-TangerineOrange   py-6'>
      <div className='container mx-auto text-center'>
        {/* Social Media Links */}
        <div className='mb-4'>
          <Link to='#' className='mx-2 text-white hover:text-yellow-400 hover:underline hover:underline-offset-2 text-xl'>
            <FontAwesomeIcon icon={faFacebook} />
          </Link>
          <Link to='#' className='mx-2 text-white hover:text-yellow-400 hover:underline hover:underline-offset-2 text-xl'>
            <FontAwesomeIcon icon={faInstagram} />
          </Link>
          <Link to='#' className='mx-2 text-white hover:text-yellow-400 hover:underline hover:underline-offset-2 text-xl'>
            <FontAwesomeIcon icon={faTwitter} />
          </Link>
        </div>

        {/* Footer Navigation Links */}
        <div className='mb-4'>
          <Link to='/' className='mx-2 text-white hover:text-yellow-400 hover:underline hover:underline-offset-2 text-lg'>
            Home
          </Link>
          <Link to='#' className='mx-2 text-white hover:text-yellow-400 hover:underline hover:underline-offset-2 text-lg'>
            Shop
          </Link>
          <Link to='/about' className='mx-2 text-white hover:text-yellow-400 hover:underline hover:underline-offset-2 text-lg'>
            About Us
          </Link>
          <Link to='/contact' className='mx-2 text-white hover:text-yellow-400 hover:underline hover:underline-offset-2 text-lg'>
            Contact
          </Link>
        </div>

        {/* Footer Text */}
        <div className='text-white'>
          © 2024 Dolly Chai Wala. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;