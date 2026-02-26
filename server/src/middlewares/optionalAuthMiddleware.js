const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nolan-secret-key-123';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // Invalid token, treat as guest
        }
    }
    next();
};
