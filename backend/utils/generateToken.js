const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is missing from environment variables.');
  }

  return secret;
};

const getRefreshSecret = () => {
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
};

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      id: userId.toString(),
      role,
      type: 'access',
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    }
  );
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      id: userId.toString(),
      role,
      type: 'refresh',
    },
    getRefreshSecret(),
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
