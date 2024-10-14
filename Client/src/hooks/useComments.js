import axios from "axios";
import { useEffect, useState } from "react";

const useComments = (url, token) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShopComments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
             
             
              
                setComments(response.data.comments.shop_comments); // assuming the data is in response.data
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };


        fetchShopComments();
    }, [url, token]);

    return { comments, loading, error ,setComments};
};

export default useComments;
