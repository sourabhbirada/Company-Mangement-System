const { getUser } = require("../service/authication");


function checkAuth(req, res, next) {
    const tokenCookie = req.cookies?.token;
    console.log('JWT Token from cookies:', tokenCookie);

    if (!tokenCookie) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = getUser(tokenCookie);
    if (!user) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
}






function restricto(allowedRoles) {
    return function (req, res, next) {
        console.log('User:', req.user); 
        const { role } = req.user || {};
        
        if (!role || !allowedRoles.includes(role)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    };
}





module.exports = {
    checkAuth,
    restricto,
};
