const express = require('express');

const {
  getAdminSettings,
  updateAdminSettings,
} = require('../controllers/adminSettingsController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Admin'));

router.get('/', getAdminSettings);
router.patch('/', updateAdminSettings);

module.exports = router;
