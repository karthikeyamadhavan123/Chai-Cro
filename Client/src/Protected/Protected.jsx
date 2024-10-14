import React ,{useEffect}from 'react';

import { useNavigate } from 'react-router-dom';


const Protected = ({ Comp }) => {
    const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
    const user = JSON.parse(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
           
            navigate('/api/login');
        }
    
    }, [user, navigate]);

    // Return null to prevent rendering if not authenticated
    if (!user) return null;

    return (
        <>
            <Comp/>
           
        </>
    );
};

export default Protected;
