const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Received Authorization header:', authHeader);  // Debug log

  const token = authHeader ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);  // Debug log
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;


