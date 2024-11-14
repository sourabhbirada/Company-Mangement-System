const jwt = require('jsonwebtoken');
const secret = "sourabh"


function setUser(user) {
    const payload = {
        loginId: user.loginId,
        username: user.username,
        role: user.role,
    };

    
    
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secret, options);
}


function getUser(token) {
    try {
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        
        return decoded; 
    } catch (error) {
        return null; 
    }
}

function authenticateJWT(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        req.user = decoded; 
        next(); 
    });
}


module.exports = {
    setUser,
    getUser,
    authenticateJWT
}