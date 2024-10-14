import React from 'react'

const ProductHovering = ({name,price,description,category}) => {
  return (
    <div className="bg-[#2C2A35] rounded-lg shadow-lg overflow-hidden w-64 flex flex-col p-4 cursor-pointer h-64 font-lora">
        {/* Shop Details */}
        <h2 className="text-white font-semibold text-lg hover:underline">{name}</h2>
      
        <p className="text-gray-400 text-sm">
          <strong>Price:</strong> {price}
        </p>
        <p className="text-gray-400 text-sm">
          <strong>Description:</strong> {description}
        </p>
        <p className="text-gray-400 text-sm">
          <strong>Category:</strong> {category}
        </p>
      </div>
  )
}

export default ProductHovering
