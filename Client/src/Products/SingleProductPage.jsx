import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductNavbar from './productNavbar';

const SingleProductPage = () => {
    const [product, setProduct] = useState(null);
    const token = useSelector((state) => state.user.token);
    const userId = useSelector((state) => state.user.userId)
    const { productId } = useParams();
    //  const[count,setCount]=useState(0)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/shop-products/${productId}/product-information`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );


                setProduct(response.data.product);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };
        fetchData();
    }, [token, productId]);

    if (!product) return <div>Loading...</div>;

    const addToCart = async () => {
        try {
            
             await axios.post(`http://localhost:8080/cart/${userId}/${productId}/add`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
           

            
            
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div className='bg-gradient-to-r from-Coral to-TangerineOrange min-h-screen' >
            <ProductNavbar />
            <div className=" flex flex-col items-center py-10  ">

                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
                    {/* Product Image */}
                    <img
                        src={product.p_image}
                        alt={product.p_name}
                        className="w-30 h-64 object-cover rounded-md mb-6 flex items-center"
                    />
                    {/* Product Information */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold text-gray-900">{product.p_name}</h1>
                        <p className="text-sm text-gray-500">Category: <span className="font-medium">{product.category}</span></p>
                        <p className="text-gray-700">Description: <span className="font-light">{product.description}</span></p>
                        <p className="text-2xl font-semibold text-blue-600">Price: ₹{product.price}</p>
                        <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </p>
                    </div>
                    {/* Buttons */}
                    {product.stock > 0 ? (
                        <div className="flex gap-4 mt-6">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition" onClick={ addToCart}>
                                Add to Cart
                            </button>
                            {/* <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition">
                                Buy Now
                            </button> */}
                        </div>
                    ) : (
                        <p className="text-red-500 mt-6">Sorry, this product is out of stock</p>
                    )}
                    {/* Comments Section */}
                    <div className="mt-8 space-y-2">
                        <h2 className="text-xl font-bold text-gray-900">Comments:</h2>
                        {product.comments && product.comments.length > 0 ? (
                            <div className="bg-gray-100 p-4 rounded-md shadow-inner">
                                {product.comments.map((comment, index) => (
                                    <p key={index} className="text-gray-800 border-b pb-2 mb-2">{comment}</p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No Comments Available</p>
                        )}
                    </div>
                    {/* Ratings Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-gray-900">Ratings:</h2>
                        {product.ratings > 0 ? (
                            <p className="text-yellow-500 font-semibold">{product.ratings} ★</p>
                        ) : (
                            <p className="text-gray-500">No Ratings Available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProductPage;
