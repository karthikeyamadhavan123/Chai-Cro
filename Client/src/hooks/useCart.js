import axios from "axios";
import { useEffect, useState } from "react";

const useCart = (url, token) => {
    const [cart, setCart] = useState([]); // Updated variable name
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const[price,setPrice]=useState(0)
    const[quantity,setQuantity]=useState(0)

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                
                if (response.data) {
                    setCart(response.data.cart);
                    setPrice(response.data.Cartprice)
                    setQuantity(response.data.cartquantity)
                     // Set the cart data
                }
                
                
            } catch (err) {
                setError(err.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [url, token]);

    return { cart, loading, error, setCart,price,quantity}; // Use updated variable names
};

export default useCart;
