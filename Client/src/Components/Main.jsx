import React from 'react'
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import { useNavigate } from 'react-router-dom'
import image from '../images/HomeImages/image.jpeg'
import image2 from '../images/HomeImages/images.jpeg'
import image3 from '../images/HomeImages/charminar.jpg'
import image4 from '../images/HomeImages/Fashion.webp'

const Main = () => {
  const navigate=useNavigate()
  const [text] = useTypewriter({
    words: [
      "Uncover hidden gems from India's most famous street markets, all in one place.",
      "Shop authentic Indian street fashion, curated just for you.",
      "Embrace the spirit of India's markets with every purchase.",
      "Discover styles that blend tradition and modernity seamlessly.",
      "Bring home the colors and textures of India's street markets today."
    ],
    loop: {}, // loop indefinitely
    typeSpeed: 120,
    deleteSpeed: 50
  })
  const handleNavigation=()=>{
    navigate('/shop')
  }

  return (
    <div className='w-full flex flex-col md:flex-row mt-4 ml-3 items-start md:items-center pl-4'>
      {/* Text Section */}
      <section className='text-white font-Playfair font-bold md:w-1/2'>
        <h1 className='text-3xl mb-3'>
          Step into the Heart of India's Street Fashion!
        </h1>
        <p className='font-extrabold mb-4'>
          Experience the vibrant culture of India with exclusive collections handpicked from iconic street markets across the country, like Charminar, Sarojini Nagar, and beyond. Discover the essence of Indian street fashion right at your fingertips.
        </p>
        <p className='text-lg'>
          {text}
          <Cursor cursorStyle='|' />
        </p>
        <div className='mt-6'>
         <button className='w-32 h-12 border rounded-full hover:bg-yellow-400 hover:text-black font-lora' onClick={handleNavigation}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Image Section */}
      <section className='mt-8 md:mt-0 md:ml-8 text-gray-200 md:w-1/2 relative right-7 hidden md:block'>

        <div className='grid grid-cols-2 gap-3'>
          <img
            src={image}
            alt="Indian Street Fashion"
            className='w-72 h-40 object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-[0px_0px_15px_5px_rgba(255,255,255,1)]'
          />
          <img
            src={image2}
            alt="Indian Street Fashion"
            className='w-72 h-40 object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-[0px_0px_15px_5px_rgba(255,255,255,1)]'
          />
          <img
            src={image3}
            alt="Indian Street Fashion"
            className='w-72 h-40 object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-[0px_0px_15px_5px_rgba(255,255,255,1)]'
          />
          <img
            src={image4}
            alt="Indian Street Fashion"
            className='w-72 h-40 object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-[0px_0px_15px_5px_rgba(255,255,255,1)]'
          />
        </div>
      </section>
    </div>
  )
}

export default Main