import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { Helmet } from 'react-helmet-async';
const Contact = () => {
  const[sendmessage,setsendmessage]=useState({
    username:'',
    email:'',
    message:''
  })

  const handleChange=(e)=>{
    const{name,value}=e.target
    setsendmessage(prev=>({
      ...prev,
      [name]:value
    }))
    console.log(sendmessage);
    
  }
  return (
    <>
    <Helmet>
    <title>Conatct Us|Chaicro</title>
    <meta name="description" content="Contact Us" />
    <meta name="keywords" content="ChaiCro,Contact" />
  </Helmet>
    <div className='w-full h-full bg-gradient-to-r from-Coral to-TangerineOrange  font-Playfair px-3'>
    <Navbar/>
    <div className=" text-white py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-lg">
            We love to hear from our customers! Whether you have a question, need assistance, or
            want to share your feedback, feel free to reach out to us. Our team is here to help and
            ensure you have the best experience with Dolly Chai Wala.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Contact Information</h2>
          <ul className="text-lg list-disc list-inside ml-6">
            <li>
              <strong>Email:</strong> <a href="mailto:support@dollychaiwala.com" className="text-blue-600 underline">support@dollychaiwala.com</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-600 underline">+123-456-7890</a>
            </li>
            <li>
              <strong>Address:</strong> Dolly Chai Wala, Street 123, City, State, ZIP
            </li>
            <li>
              <strong>Customer Service Hours:</strong> Monday - Friday, 9 AM - 6 PM (IST)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Customer Support</h2>
          <p className="text-lg">
            Our customer support team is dedicated to assisting you with any inquiries or issues you
            may have. Whether you need help with your order, have questions about our products, or
            need assistance navigating our website, we’re here to help. Reach out to us via email or
            phone, and we’ll respond as quickly as possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 ">Contact Form</h2>
          <p className="text-lg text-gray-700 mb-4">
            You can reach out to us by filling out the form below. Our team will get back to
            you as soon as possible.
          </p>
          <form className="max-w-lg mx-auto text-black font-lora">
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Your Name" 
                required name='username' value={sendmessage.username} onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Your Email" 
                required name='email' value={sendmessage.email} onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="message">Message</label>
              <textarea 
                id="message" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Your Message" 
                rows="5" 
                required name='message' value={sendmessage.message} onChange={handleChange}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
    <Footer/>
    </div>
    </>
  )
}

export default Contact