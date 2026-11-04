const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ProgramUser = require('../models/ProgramUser');

const getSecret = () => {
  const secret = process.env.BUSINESS_PROGRAM_JWT_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('Business Program JWT secret is missing.');
  return secret;
};

const getToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

const protectBusinessProgram = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Program sign-in required.' });

  let decoded;
  try {
    decoded = jwt.verify(token, getSecret());
  } catch (_error) {
    return res.status(401).json({ message: 'Program session expired or invalid.' });
  }

  if (decoded.scope !== 'business-program' || !decoded.programUserId) {
    return res.status(401).json({ message: 'This session is not valid for the Business Program.' });
  }

  const programUser = await ProgramUser.findById(decoded.programUserId);
  if (!programUser || programUser.status !== 'active') {
    return res.status(403).json({ message: 'This program account is not active.' });
  }

  req.programUser = programUser;
  next();
});

const authorizeProgramRoles = (...roles) => (req, res, next) => {
  if (!req.programUser || !roles.includes(req.programUser.role)) {
    return res.status(403).json({ message: 'You do not have access to this program action.' });
  }
  next();
};

module.exports = { protectBusinessProgram, authorizeProgramRoles, getBusinessProgramSecret: getSecret };
