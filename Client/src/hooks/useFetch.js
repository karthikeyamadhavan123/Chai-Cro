import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url, token) => {
    const [shop, setShop] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
             
              
                setShop(response.data.allShops); // assuming the data is in response.data
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };


        fetchShops();
    }, [url, token]);

    return { shop, loading, error ,setShop};
};

export default useFetch;
