const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const ensureAuthenticated = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).json({ message: 'Authorization header is required' });
    }
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {
    ensureAuthenticated
};