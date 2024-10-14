  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { useParams, useNavigate, Link } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import getAdminStatus from '../Admin/Admin';
  import AddProducts from '../Products/AddProducts';
  import { Helmet } from 'react-helmet-async';

  const ShopProducts = () => {
    const { id } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const nav = useNavigate();
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null); // New state to store product to be edited
    const [editedDetails, setEditedDetails] = useState({}); // State for storing edited product details
    const [selectedImage, setSelectedImage] = useState(null);
    const[Username,setUsername]=useState(null)
    const[shopname,setShopName]=useState(null)
    useEffect(() => {
      const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
      const parsedAuth = auth ? JSON.parse(auth) : null;
      const token = parsedAuth?.token;
      const username=parsedAuth?.username
      setUsername(username)

      const checkSessionExpiry = () => {
        const loginTime = localStorage.getItem('loginitem') || localStorage.getItem('registerTime');
        if (loginTime) {
          const currentTime = new Date().getTime();
          const timeElapsed = currentTime - Number(loginTime);
          const twoHours = 2 * 60 * 60 * 1000;

          if (timeElapsed > twoHours) {
            localStorage.clear();
            toast('Session expired. Please log in again.');
            nav('/api/login');
          }
        }
      };

      const fetchProducts = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/shop/${id}/products`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
 

          const { shop_products } = response.data.Products;
          const {shop_name}=response.data
          
          
          setShopName(shop_name)
          setProducts(shop_products);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };

      const checkAdmin = () => {
        const adminStatus = getAdminStatus();
        setIsAdmin(adminStatus);
      };

      checkSessionExpiry();
      fetchProducts();
      checkAdmin();
    }, [id, nav]);

    const deleteProduct = async (productId) => {
      const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
      const parsedAuth = auth ? JSON.parse(auth) : null;
      const token = parsedAuth?.token;

      try {
        await axios.delete(`http://localhost:8080/shop/${productId}/${id}/delete/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      
        setProducts(products.filter(product => product._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    const handleEditClick = (product) => {
      setEditProduct(product); // Set the product to be edited
      setEditedDetails(product); // Set initial values for the form
      setSelectedImage(null); // Reset the image input
    };

    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditedDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
      setSelectedImage(e.target.files[0]); // Set the selected image file
    };

    const handleEditSubmit = async () => {
      const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
      const parsedAuth = auth ? JSON.parse(auth) : null;
      const token = parsedAuth?.token;

      const formData = new FormData();
      formData.append('p_name', editedDetails.p_name);
      formData.append('p_type', editedDetails.p_type);
      formData.append('price', editedDetails.price);
      formData.append('description', editedDetails.description);

      if (selectedImage) {
        formData.append('product_image', selectedImage); // Append the new image if selected
      }

      try {
        const response = await axios.put(`http://localhost:8080/shop/${editProduct._id}/${id}/edit/products`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Ensure the content type is set to multipart for file uploads
          },
        });
        console.log('Product updated:', response.data);

        setProducts(products.map(product => product._id === editProduct._id ? { ...editedDetails, p_image: selectedImage ? URL.createObjectURL(selectedImage) : product.p_image } : product));
        setEditProduct(null); // Close the modal or edit form after update
        toast.success('Product updated successfully!');
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product.');
      }
    };

    return (
      <>
      <Helmet>
          <title>{shopname ? `${shopname} All products` : 'Loading... | ChaiCro'}|ChaiCro</title>
          <meta name="description" content="Products." />
          <meta name="keywords" content="Products,add" />
        </Helmet>
      <div className='bg-gradient-to-r from-Coral to-TangerineOrange min-h-screen flex flex-row' style={{ paddingTop: '20px', paddingLeft: '20px' }}>
        {products.length === 0 ? (
          <h2 className='text-white font-henny font-bold text-center pt-3'>Create Your 1st product</h2>
        ) : (
          <div className='min-h-screen w-screen'>
            <div>
              <h1 className='text-white font-bold font-lato'>Welcome {Username.toUpperCase()}</h1>
              <h1 className='text-white font-bold text-2xl text-center'>All Products</h1>
              {products.map((product, index) => (
                <div key={index} className="relative text-black">
                  <div className="bg-white border w-64 p-4 flex flex-col justify-center items-center transition-all duration-300 ease-in-out rounded-xl shadow-2xl hover:scale-110 hover:ease-in-out hover:duration-400 font-bold">
                    <img src={product.p_image} alt={product.p_name} className="w-56 h-56 object-cover mb-2 rounded-xl" />
                    <Link className="text-center font-semibold mb-2 hover:font-lora hover:underline hover:text-fuchsia-300" to={`/shop/${product._id}/product-information`}>{product.p_name}</Link>
                    <h2 className="font-semibold">{product.p_type}</h2>
                    <p className="mt-1">Price: ${product.price}</p>
                    <p className="mt-2">{product.description}</p>

                    {isAdmin ? (
                      <div className="w-full flex justify-between mt-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm" onClick={() => handleEditClick(product)}>Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm" onClick={() => deleteProduct(product._id)}>Delete</button>
                      </div>
                    ) : (
                      <button className='bg-green-200 w-28 h-8 rounded-xl'>Order Now</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className='absolute bottom-2 left-[45%]'>
            <AddProducts shopId={id} />
          </div>
        )}

        {/* Edit product modal or form */}
        {editProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-2">Edit Product</h2>
              <label className="block mb-2">
                Product Name:
                <input
                  type="text"
                  name="p_name"
                  value={editedDetails.p_name || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block mb-2">
                Product Type:
                <input
                  type="text"
                  name="p_type"
                  value={editedDetails.p_type || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block mb-2">
                Price:
                <input
                  type="number"
                  name="price"
                  value={editedDetails.price || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block mb-2">
                Description:
                <textarea
                  name="description"
                  value={editedDetails.description || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block mb-2">
                Stock:
                <input
                  type="number"
                  name="stock"
                  value={editedDetails.stock || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block mb-2">
                Product Image:
                <input
                  type="file"
                  name="product_image"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <div className="flex justify-between mt-4">
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleEditSubmit}>
                  Save
                </button>
                <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setEditProduct(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    );
  };

  export default ShopProducts;
