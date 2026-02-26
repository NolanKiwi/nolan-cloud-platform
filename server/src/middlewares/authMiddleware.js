const jwt = require('jsonwebtoken');
const prisma = require('../db');

// JWT Secret Key (Same as authController)
const JWT_SECRET = process.env.JWT_SECRET || 'nolan-secret-key-123';

/**
 * Auth Middleware
 * Supports both JWT (Bearer Token) and API Key (x-api-key)
 */
module.exports = async (req, res, next) => {
    // 1. Check for API Key first (for CLI/Automation)
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        try {
            const keyRecord = await prisma.apiKey.findUnique({
                where: { key: apiKey },
                include: { user: true } // Fetch associated user
            });

            if (!keyRecord) {
                return res.status(401).json({ error: 'Invalid API Key' });
            }

            // Update last used time (async, don't block)
            prisma.apiKey.update({
                where: { id: keyRecord.id },
                data: { lastUsedAt: new Date() }
            }).catch(err => console.error('Failed to update API key stats', err));

            // Attach user info (mimic JWT payload)
            req.user = { id: keyRecord.userId, email: keyRecord.user.email };
            return next();
        } catch (error) {
            console.error('API Key Auth Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // 2. Check for JWT (Bearer Token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
    }

    // 3. No credentials provided
    return res.status(401).json({ error: 'Access denied. No token or API key provided.' });
};
