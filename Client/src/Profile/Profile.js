import axios from "axios";

async function getUserImage() {
    try {
        const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
        const parsedAuth = auth ? JSON.parse(auth) : null;
        const token = parsedAuth?.token;
        const userId = parsedAuth?.userId;

        if (!token || !userId) {
            throw new Error('Authentication data is missing');
        }

        const result = await axios.get(`http://localhost:8080/api/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });


        const  image  = result.data.userimage;
        if (!image) {
            throw new Error('Image not found in user data');
        }

        return image;
    } catch (error) {
        console.error('Error fetching user image:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}

export default getUserImage;