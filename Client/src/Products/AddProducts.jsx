import React from 'react'
import { useNavigate } from 'react-router-dom'

const AddProducts = ({shopId}) => {
  const navigate=useNavigate();
  const onclick=()=>{
    navigate(`/${shopId}/product/new`)
  }
  return (
    <>
   
    <div>

      <button className='text-white bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 w-40 h-8 rounded-xl' onClick={onclick}>Add New Product</button>
    </div>
    </>
  )
}

export default AddProducts
