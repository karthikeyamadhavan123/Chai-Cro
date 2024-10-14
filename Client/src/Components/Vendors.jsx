import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Helmet } from 'react-helmet-async';
import Vendor from '../images/Vendor/vendor.jpeg'
import download from '../images/Vendor/download.jpeg'
import street from '../images/Vendor/street.jpeg'

const Vendors = () => {
  const vendors = [
    {
        id: 1,
        name: "Vendor 1",
        comment: "This is a great vendor",
        image: Vendor
    },
    {
        id: 2,
        name: "Shop 2",
        comment: "This shop has a wide variety of products",
        image: download
    },
    {
        id: 3,
        name: "Shop 3",
        comment: "This shop has a great customer service",
        image: street
    },
  
];
  return (
    <>
    <Helmet>
        <title>Vendors|Chaicro</title>
        <meta name="description" content="Vendors" />
        <meta name="keywords" content="ChaiCro,Vendors" />
    </Helmet>
     <div className='w-screen h-full bg-gradient-to-r from-Coral to-TangerineOrange'>
        <Navbar />
        <section className="p-8">
                    <div className="grid grid-cols-1 gap-8">
                        {vendors.map((vendor) => (
                            <div key={vendor.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                                <div className="w-1/3">
                                    <img src={vendor.image} alt={vendor.name} className="object-cover w-full h-full"/>
                                </div>
                                <div className="p-4 w-2/3 flex flex-col justify-center">
                                    <h3 className="text-lg font-semibold mb-2">{vendor.name}</h3>
                                    <p className="text-gray-600">{vendor.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
        <Footer />
    </div>
</>
  )
}

export default Vendors
