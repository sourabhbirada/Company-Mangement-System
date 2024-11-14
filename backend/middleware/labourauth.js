


function ensureLaborAuth(req, res, next) {
    if (!req.session.loginId || req.session.role !== 'emp') {
        return res.status(401).json({ message: 'Unauthorized: Please log in as labor.' });
    }
    next();
}



module.exports = {
    ensureLaborAuth
}