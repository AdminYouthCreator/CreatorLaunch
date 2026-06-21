const asyncHandler = require('express-async-handler');
const ToolSubmission = require('../models/ToolSubmission');

const createBuildABusinessSubmission = asyncHandler(async (req, res) => {
  const { name = '', email = '', role = 'student', response = {} } = req.body || {};

  if (!response || typeof response !== 'object') {
    return res.status(400).json({ message: 'A response object is required.' });
  }

  const submission = await ToolSubmission.create({
    tool: 'build-a-business',
    name,
    email,
    role,
    response,
  });

  res.status(201).json({
    message: 'Your response was saved successfully.',
    submissionId: submission._id,
  });
});

module.exports = {
  createBuildABusinessSubmission,
};