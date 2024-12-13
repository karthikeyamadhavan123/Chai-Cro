const token=require('jsonwebtoken');
const path=require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const secret=process.env.SECRET_KEY;
const jwt=require('jsonwebtoken');

const createToken=(payload)=>{
return token.sign(payload,secret,{
    expiresIn:'2h',
})
}



const verifyToken = (inputToken, secret) => {
  try {
    // Verify the JWT and extract the decoded payload
    const decoded = jwt.verify(inputToken, secret);
    // If the token is valid, return the userId
    return { userId: decoded.userId }; 
  } catch (error) {
    // Log the error details for debugging
    console.error('JWT Verification Error:', error);

    // Check if the error is due to token expiration
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expired', expired: true }; // Indicate that the token is expired
    }
    // Handle other types of errors (e.g., invalid token)
    return { error: 'Invalid token' }; // Indicate that the token is invalid
  }
};

module.exports = verifyToken;


module.exports={
    createToken,
    verifyToken
}