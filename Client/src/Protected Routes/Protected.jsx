import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Protected = ({ Component }) => {
    const login = useSelector(state => state.user.isLoggedIn)
    const navigate = useNavigate();
    useEffect(() => {
        
        if (!login) {
            navigate('/api/login')
        }
    })
    return (
        <div>
            <Component/>
        </div>
    )
}

export default Protected
