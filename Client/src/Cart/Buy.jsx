import React from 'react'
import { useNavigate } from 'react-router-dom'

const Buy = ({localPrice,cart}) => {
    const navigate=useNavigate();
    console.log(cart);
    
    const save=()=>{
        const cart1=JSON.stringify(cart)
        localStorage.setItem('cart',cart1)
        navigate('/order')
    }
  return (
    <div>
       <button className='absolute bottom-1 left-[44rem] bg-white w-56 h-10 rounded-full hover:bg-amber-300 hover:text-white' onClick={save}>Buy items ₹{localPrice}</button> 
    </div>
  )
}

export default Buy
