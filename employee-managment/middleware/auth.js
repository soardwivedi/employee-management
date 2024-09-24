const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('token', token);
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request object
    console.log(req.user, 'decoded', decoded);
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;
