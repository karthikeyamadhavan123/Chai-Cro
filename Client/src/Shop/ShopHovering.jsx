const ShopHovering = ({ name, district, code, address }) => {
    return (
      <div className="bg-[#2C2A35] rounded-lg shadow-lg overflow-hidden w-64 flex flex-col p-4 cursor-pointer h-64 font-lora">
        {/* Shop Details */}
        <h2 className="text-white font-semibold text-lg hover:underline">{name}</h2>
        <p className="text-gray-400 text-sm">
          <strong>Address:</strong> {address}
        </p>
        <p className="text-gray-400 text-sm">
          <strong>Postal Code:</strong> {code}
        </p>
        <p className="text-gray-400 text-sm">
          <strong>District:</strong> {district}
        </p>
      </div>
    );
  };
  
  export default ShopHovering;
  