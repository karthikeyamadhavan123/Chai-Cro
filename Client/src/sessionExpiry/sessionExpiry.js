const checkSessionExpiry = () => {
    const loginTime = localStorage.getItem('loginitem') || localStorage.getItem("registerTime");
  
    if (loginTime) {
      const loginTimeMs = Number(loginTime); // Convert login time to a number
      const expiryTime = loginTimeMs + 2 * 60 * 60 * 1000; // Add 2 hours (in milliseconds) to the login time
      const currentTime = new Date().getTime();
  
      if (currentTime >= expiryTime) { // Check if the current time is greater than or equal to the expiry time
        localStorage.clear(); // Clear all local storage to log out the user
        return true; // Session expired
      }
      return false; // Session is still valid
    }
  
    return false; // No login time found, session not active or already logged out
  };
  
  export default checkSessionExpiry;
  