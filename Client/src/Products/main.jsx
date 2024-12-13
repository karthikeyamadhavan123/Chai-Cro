import React from 'react'
import ProductNavbar from './productNavbar'
import Products from './Products'
const main = () => {
  return (
    <div className='bg-gradient-to-r from-Coral to-TangerineOrange p-8 min-h-screen flex flex-col'>
      <ProductNavbar/>
      <Products/>
    </div>
  )
}

export default main
