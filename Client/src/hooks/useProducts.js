import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url, token) => {
    const [shopProducts, setShopProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
    useEffect(() => {
        const fetchShopProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
             
              setShopProducts(response.data.Products.shop_products)
              
                // setShop(response.data.allShops); // assuming the data is in response.data
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };


        fetchShopProducts();
    }, [url, token]);

    return { shopProducts, loading, error ,setShopProducts};
};

export default useFetch;
