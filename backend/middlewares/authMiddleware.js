const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getTokenFromRequest = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId || decoded.id).select('-password');

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
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed.' });
  }
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
