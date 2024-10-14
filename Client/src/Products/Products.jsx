import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useProducts from '../hooks/useProducts';
import checkSessionExpiry from '@/sessionExpiry/sessionExpiry';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import ProductHovering from './productHovering';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const Products = () => {
  const nav = useNavigate();
  const { id } = useParams(); // shop id
  const token = useSelector((state) => state.user.token);
  const url = `http://localhost:8080/shop-products/${id}/products`;
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { shopProducts, loading, error, setShopProducts } = useProducts(url, token);
  const [editedProduct, setEditedProduct] = useState(null);
  const admin = useSelector((state) => state.user.userType);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const check = checkSessionExpiry();
    if (check) {
      nav('/api/login');
      return;
    }
    if (error) {
      toast.error(`Error: ${error.message || 'Failed to fetch Products details.'}`, {
        position: 'top-right',
      });
    }

    if (!loading && shopProducts.length > 0 && !productsLoaded) {
      toast.success('Products loaded successfully!', {
        position: 'top-right',
      });
      setProductsLoaded(true);
    }
  }, [id, error, loading, shopProducts, productsLoaded]);

  const handleMouseEnter = (product, e) => {
    setHoveredProduct(product);
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  const handleNav = () => {
    nav(`/shop/${id}/new`);
  };

  const handleProductDeletion = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/shop-products/${productId}/${id}/delete/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShopProducts(prevShops => prevShops.filter(singleShopProduct => singleShopProduct._id !== productId));
      setHoveredProduct(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditedProduct(product);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('p_name', editedProduct.p_name);
      formData.append('price', editedProduct.price);
      formData.append('description', editedProduct.description);
      formData.append('category', editedProduct.category);

      if (editedProduct.p_image) {
        formData.append('product_image', editedProduct.p_image);
      }

      await axios.put(`http://localhost:8080/shop-products/${editedProduct._id}/${id}/edit/products`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the product list after successful edit
      setShopProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === editedProduct._id ? { ...editedProduct } : product
        )
      );

      // Clear the edit form and hide modal
      setEditedProduct(null);
      toast.success('Product updated successfully!', {
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>All Products</title>
        <meta name="description" content="Products" />
        <meta name="keywords" content="ChaiCro, Products" />
      </Helmet>
      <div className='bg-gradient-to-r from-Coral to-TangerineOrange p-8 min-h-screen'>
        <div className='text-black'>
          {loading && <ClipLoader color="#ffffff" loading={loading} size={20} />}

          {!loading && error && (
            <div className="text-red-500 text-lg font-semibold mt-4">
              Oops! Something went wrong: {error.message || 'Failed to fetch shop details.'}
            </div>
          )}
          {(shopProducts.length === 0 && admin==='admin') ? (
            <div className="text-center text-xl text-white mt-4">
              No products available. Click the button below to add a product.
            </div>
          ) : !loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shopProducts.map((product) => (
                <div className="bg-[#2C2A35] rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer font-lora transition-transform transform hover:scale-105" key={product._id}>
                  <div className="relative" onMouseEnter={(e) => handleMouseEnter(product, e)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
                    <img src={product.p_image} alt={product.p_name} className="object-cover w-full h-80" />
                  </div>

                  <div className="p-4">
                    <p className="text-white font-semibold text-lg hover:underline">{product.p_name}</p>
                    <p className="text-white font-semibold text-lg hover:underline">₹{product.price}</p>
                    <p className="text-white font-semibold text-lg hover:underline">{product.category}</p>
                    {admin === 'admin' && (
                      <div className='flex gap-5 mt-4'>
                        <button className='bg-green-300 mb-2 h-10 w-24 rounded-full hover:bg-green-400 transition ease-in-out' onClick={() => handleEditProduct(product)}>
                          Edit
                        </button>
                        <button className='bg-red-500 h-10 w-24 rounded-full hover:bg-red-400 transition ease-in-out' onClick={() => handleProductDeletion(product._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {hoveredProduct && (
                <div
                  className='absolute z-10 transition-opacity duration-700 opacity-100'
                  style={{
                    left: `${mousePosition.x + 20}px`,
                    top: `${mousePosition.y + 20}px`,
                  }}
                >
                  <ProductHovering
                    name={hoveredProduct.p_name}
                    price={hoveredProduct.price}
                    description={hoveredProduct.description}
                    category={hoveredProduct.category}
                  />
                </div>
              )}
            </div>
          )}
          {admin === 'admin' && (
            <div className='fixed bottom-8 left-0 right-0 flex justify-center'>
              <button className='bg-white w-40 h-10 rounded-lg font-raleway hover:bg-amber-300 hover:transition-colors hover:ease-in-out hover:text-white' onClick={handleNav}>
                Add Your Product
              </button>
            </div>
          )}

          {editedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out font-Playfair">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 transform transition-all duration-500 ease-in-out">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Edit Product: {editedProduct.p_name}</h2>

                {/* Form to edit product details */}
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="productName">Product Name</label>
                    <input
                      type="text"
                      id="productName"
                      className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={editedProduct.p_name}
                      onChange={(e) => setEditedProduct({ ...editedProduct, p_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={editedProduct.category}
                      onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={editedProduct.description}
                      onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="image">Image</label>
                    <input
                      type="file"
                      id="image"
                      className="w-full"
                      onChange={(e) => setEditedProduct({ ...editedProduct, p_image: e.target.files[0] })}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
                    >
                      Update Product
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300"
                      onClick={() => setEditedProduct(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Products;
