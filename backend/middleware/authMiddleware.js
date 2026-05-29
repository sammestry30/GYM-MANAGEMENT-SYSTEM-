// File: middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// This is our main authentication middleware
exports.authMiddleware = (req, res, next) => {
    // 1. Get the token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if there's no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    // 3. If there is a token, verify it
    try {
        const JWT_SECRET = 'your_super_secret_key_that_is_long_and_random';
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Attach the user's info (from the token) to the request object
        req.user = decoded.user;
        next(); // Move on to the next function (the controller)

    } catch (err) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

// This is a second middleware to check for admin role
exports.isAdmin = (req, res, next) => {
    // This runs AFTER authMiddleware, so we already have req.user
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Requires admin role.' });
    }
    next();
};