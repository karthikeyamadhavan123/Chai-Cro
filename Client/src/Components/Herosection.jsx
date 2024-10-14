import React from 'react'
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Main from './Main';
import CommentsSection from './Comments';
import Footer from './Footer';


const HeroSection = () => {
  
  return (
    <>
      <Helmet>
        <title>Chaicro - Where Tradition Meets Modern Styles</title>
        <meta name="description" content="Welcome To Chaicro" />
        <meta name="keywords" content="ChaiCro,Welcome" />
      </Helmet>
      <div className='w-screen h-full bg-gradient-to-r from-Coral to-TangerineOrange'>
        <Navbar />
        <Main/>
        <CommentsSection/>
        <Footer/>
       
      </div>
    </>

  )
}

export default HeroSection;