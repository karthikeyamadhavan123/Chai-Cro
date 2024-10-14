import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getAdminStatus from '../Admin/Admin';

const AdminProtection = ({ Comp }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = getAdminStatus();
        if (!isAdmin) {
            navigate('/shop');
        }
    }, [navigate]);

    const isAdmin = getAdminStatus();
    if (!isAdmin) return null;

    return (
        <>
            <Comp />
        </>
    );
}

export default AdminProtection;
