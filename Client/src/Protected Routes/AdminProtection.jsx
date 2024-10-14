
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
const AdminProtection = ({Component}) => {
  const login = useSelector(state => state.user.userType)
  const navigate = useNavigate();
  useEffect(() => {
      
      if (!login) {
          navigate('/shop')
      }
  })
  return (
      <div>
          <Component/>
      </div>
  )
}

export default AdminProtection
