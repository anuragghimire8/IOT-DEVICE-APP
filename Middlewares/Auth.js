const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized. A valid Bearer token is required.' 
        });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ 
            success: false, 
            message: 'Unauthorized. Invalid or expired token.' 
        });
    }
};

module.exports = ensureAuthenticated;