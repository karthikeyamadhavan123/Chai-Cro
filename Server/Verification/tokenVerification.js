const jwt = require('../jwt/jwt.js'); 

function tokenVerification(req,res,next){
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('No token provided');
        }
    
        const token = authHeader.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).send('Token not found');
        }
        const secret = process.env.SECRET_KEY;
        const decoded=jwt.verifyToken(token,secret);
        req.user=decoded
        next();
        
    } catch (error) {
     console.log(error);
     return res.status(401).json({ message: 'Invalid or expired token' });
        
    }

}

module.exports=tokenVerification;