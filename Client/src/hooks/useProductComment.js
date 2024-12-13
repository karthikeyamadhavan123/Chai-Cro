import axios from "axios";
import { useEffect, useState } from "react";

const useProductComment = (url, token) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductComments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
              
                
                
                
                // Safely access the comments in the response
               if(response.data){
                setComments(response.data.comments.comments)
               }
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchProductComments();
    }, [url, token]);

    return { comments, loading, error, setComments };
};

export default useProductComment;