const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is missing from environment variables.');
  }

  return secret;
};

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization || '';

  if (header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, getJwtSecret());
  } catch (error) {
    console.error('JWT verification failed:', {
      message: error.message,
      name: error.name,
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      tokenPrefix: token ? token.slice(0, 12) : '',
    });

    return res.status(401).json({
      message: 'Not authorized, token failed.',
      tokenError: error.message,
    });
  }

  const userId = decoded.userId || decoded.id;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized, token missing user id.' });
  }

  const user = await User.findById(userId).select('-password');

  if (!user) {
    return res.status(401).json({ message: 'Not authorized, user not found.' });
  }

  if (['suspended', 'banned', 'locked'].includes(user.accountStatus)) {
    return res.status(403).json({
      message: `Account access denied. Your account is currently ${user.accountStatus}.`,
      accountStatus: user.accountStatus,
      reason: user.accountStatusReason || '',
    });
  }

  req.user = user;
  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to access this resource.',
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};
