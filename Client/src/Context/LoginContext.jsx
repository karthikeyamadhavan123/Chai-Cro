import { createContext,React, useState} from "react";

export const Logincontext=createContext();


const LoginContext = ({children}) => {
    const[isLoggedIn,setIsloggedIn]=useState(false)
  return (
    <Logincontext.Provider value={[isLoggedIn,setIsloggedIn]}>
        {children}
    </Logincontext.Provider>
  )
}

export default LoginContext
