const jwt = require('jsonwebtoken');

/*const protect = async (req, res, next) => {
    // Log the JWT_SECRET in the middleware to check if it's the same
    console.log("JWT_SECRET used for token verification:", process.env.JWT_SECRET);  // Log the secret key used for verifying the token

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.error('Authorization header is missing');
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        console.error('Invalid authorization header format');
        return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const accessToken = tokenParts[1];

    try {
        const decodedToken = await jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log(`Token successfully verified for user: ${decodedToken._id}`);
        
        // Assigning user information to req.user
        req.user = { role: decodedToken.role, _id: decodedToken._id };

        // Log req.user to verify it's being set correctly
        console.log("req.user in middleware:", req.user);

        next();
    } catch (error) {
        console.error('Invalid token', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = protect;*/


const protect = async (req, res, next) => {
    // Log the JWT_SECRET in the middleware to check if it's the same
    console.log("JWT_SECRET used for token verification:", process.env.JWT_SECRET);  // Log the secret key used for verifying the token

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.error('Authorization header is missing');
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        console.error('Invalid authorization header format');
        return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const accessToken = tokenParts[1];

    try {
        const decodedToken = await jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log('Decoded token:', decodedToken); // Log the decoded token to inspect its structure

        // Check if userId is present in the decoded token
        if (!decodedToken.userId) {
            console.error('Decoded token does not contain userId');
            return res.status(401).json({ error: 'Invalid token' });
        }

        console.log(`Token successfully verified for user: ${decodedToken.userId}`);
        
        // Assigning user information to req.user
        req.user = { role: decodedToken.role, id: decodedToken.userId };

        // Log req.user to verify it's being set correctly
        console.log("req.user in middleware:", req.user);

        next();
    } catch (error) {
        console.error('Invalid token', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = protect;