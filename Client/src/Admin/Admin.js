export default function getAdminStatus() {
    let data = localStorage.getItem('auth') || localStorage.getItem('Auth');
    if (data) {
        const Auth = JSON.parse(data);
        let admin=Auth.isAdmin||Auth.userType;

        
        if ( admin === 'admin') {
            return true
        } // Return true if the user is an admin
    }
    return false; // Return false if no data is found or user is not an admin
}
