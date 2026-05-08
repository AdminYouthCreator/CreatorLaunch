const express = require('express');

const {
  getPublicSettings,
} = require('../controllers/adminSettingsController');

const router = express.Router();

router.get('/public', getPublicSettings);

module.exports = router;
