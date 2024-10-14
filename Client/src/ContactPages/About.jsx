import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { Helmet } from 'react-helmet-async';
const About = () => {
    
  return (
    <><Helmet>
    <title>About Us|Chaicro - Where Tradition Meets Modern Styles</title>
    <meta name="description" content="About Us" />
    <meta name="keywords" content="ChaiCro,About" />
  </Helmet>
    <div className='w-full h-full bg-gradient-to-r from-Coral to-TangerineOrange  font-Playfair'>
      <Navbar/>
      <div className="about-us-page px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Welcome to ChaiCro </h2>
          <p className="text-lg">
            At ChaiCro, we bring the vibrant spirit of Indian street markets right to your
            doorstep. From the bustling lanes of Charminar to the lively bazaars of Sarojini Nagar,
            our online store offers an eclectic mix of fashion and accessories that capture the
            essence of India's rich cultural heritage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg">
           ChaiCro was born out of a love for Indian street markets and a desire to make
            these unique shopping experiences accessible to everyone, no matter where they are in
            the world. Our founder, [Your Name], noticed that despite the growing popularity of
            online shopping, there was a gap when it came to finding authentic street fashion
            online. So, in [Year], Dolly Chai Wala was launched to fill that void and to celebrate
            the diversity and creativity of Indian street vendors.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">What We Offer</h2>
          <p className="text-lg">
            We curate a wide range of products that are as diverse as the markets they come from.
            Whether you're looking for trendy apparel, one-of-a-kind accessories, or handmade
            crafts, we have something for everyone. Our collections are carefully selected to ensure
            they reflect the latest trends while maintaining the authenticity that our customers
            love.
          </p>
          <ul className="list-disc list-inside ml-6 mt-4 text-lg">
            <li><strong>Fashion for Everyone:</strong> Our collections are inspired by the latest street styles, with a special focus on fashion for girls and boys.</li>
            <li><strong>Quality and Affordability:</strong> At Dolly Chai Wala, we understand the importance of quality. We work closely with our vendors to ensure that every product meets our high standards, so you can shop with confidence.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg">
            Our mission is to create a platform that not only provides access to the best of Indian
            street fashion but also supports the local artisans and vendors who make these markets
            so special. We are committed to building a community that celebrates diversity,
            creativity, and the spirit of entrepreneurship.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside ml-6 mt-4 text-lg">
            <li><strong>Authenticity:</strong> We bring you genuine products directly from India's most famous street markets.</li>
            <li><strong>Curated Collections:</strong> Each item in our store is handpicked to ensure it meets our style and quality standards.</li>
            <li><strong>Supporting Local Vendors:</strong> By shopping with us, you're supporting the livelihoods of local artisans and small businesses.</li>
            <li><strong>Exceptional Customer Service:</strong> We are dedicated to providing our customers with a seamless shopping experience from start to finish.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Team</h2>
          <p className="text-lg">
            Behind ChaiCro is a passionate team of individuals who share a love for fashion,
            culture, and innovation. From our buyers who scour the markets for the best finds to our
            customer service team who ensures you're always taken care of, every member of our team
            plays a vital role in bringing our vision to life.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Get Involved</h2>
          <p className="text-lg">
            We love hearing from our customers! Whether you have a question, a suggestion, or just
            want to share your latest purchase, don't hesitate to reach out. Follow us on social
            media and sign up for our newsletter to stay updated on the latest arrivals and
            exclusive offers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Join the Dolly Chai Wala Family</h2>
          <p className="text-lg">
            We invite you to explore our collections and discover the unique charm of Indian street
            fashion. At ChaiCro, we believe that fashion is more than just clothing—it's a
            way to express yourself, tell your story, and connect with others. So why wait? Start
            shopping now and let us be a part of your fashion journey.
          </p>
        </section>
      </div>
    </div>
      <Footer/>
    </div>
    </>
  )
}

export default About