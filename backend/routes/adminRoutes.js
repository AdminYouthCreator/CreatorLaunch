const express = require('express');
const {
  getOverview,
  getUsers,
  getStores,
  getAnalytics,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Admin'));

router.get('/overview', getOverview);
router.get('/users', getUsers);
router.get('/stores', getStores);
router.get('/analytics', getAnalytics);

module.exports = router;
