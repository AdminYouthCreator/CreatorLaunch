const express = require('express');
const { createBuildABusinessSubmission } = require('../controllers/toolSubmissionController');

const router = express.Router();

router.post('/build-a-business', createBuildABusinessSubmission);

module.exports = router;