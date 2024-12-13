import axios from "axios";
import { useEffect, useState } from "react";

const useProductRatings = (url, token) => {
    const [ratings, setratings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductRatings = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                
             
                setratings(response.data.ratings.ratings); // assuming the data is in response.data
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };


        fetchProductRatings();
    }, [url, token]);

    return { ratings, loading, error ,setratings};
};

export default useProductRatings;
