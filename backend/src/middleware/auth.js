const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorization check:', { 
      userRole: req.user?.role, 
      requiredRoles: roles,
      userId: req.user?._id 
    });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied - ${roles.join(' or ')} role required` });
    }
    next();
  };
};
