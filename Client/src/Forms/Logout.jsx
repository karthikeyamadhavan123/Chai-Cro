import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { logoutUser as logoutUserAction } from '@/redux/slice';
import { ClipLoader } from 'react-spinners';
const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(false)
    const token=useSelector(state=>state.user.token)
    const handleLogout = async () => {
        try {
            setLoading(true)
            const response = await axios.post(
                'http://localhost:8080/api/logout',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                dispatch(logoutUserAction())
                localStorage.removeItem('registerTime')
                localStorage.removeItem('loginitem')
                toast.success('Logout Successful');
                navigate('/api/login');
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message || 'An error occurred during logout');
        }
        finally{
            setLoading(false)
        }
    };

    return (
        <>
            <div>
                <button onClick={handleLogout} className='border 2px solid bg-amber-300'>{loading?<ClipLoader color="#ffffff" loading={loading} size={20}/>:'Logout'}</button>
            </div>
            <ToastContainer />
        </>
    );
};

export default Logout;