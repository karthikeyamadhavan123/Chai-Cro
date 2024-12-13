import axios from "axios";
import { useEffect, useState } from "react";

const useRatings = (url, token) => {
    const [ratings, setratings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShopRatings = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
             
              const {ratings}=response.data.Ratings
              
                setratings(ratings); // assuming the data is in response.data
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };


        fetchShopRatings();
    }, [url, token]);

    return { ratings, loading, error ,setratings};
};

export default useRatings;
