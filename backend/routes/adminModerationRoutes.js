const express = require('express');
const {
  updateUserStatus,
  updateUserAdminNotes,
  forceUserPasswordReset,
  updateStoreStatus,
  updateStoreAdminNotes,
  adminUpdateProduct,
  adminUpdateService,
  getAuditLogs,
} = require('../controllers/adminModerationController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Admin'));

router.patch('/users/:userId/status', updateUserStatus);
router.patch('/users/:userId/notes', updateUserAdminNotes);
router.patch('/users/:userId/force-password-reset', forceUserPasswordReset);

router.patch('/stores/:brandId/status', updateStoreStatus);
router.patch('/stores/:brandId/notes', updateStoreAdminNotes);

router.put('/products/:productId', adminUpdateProduct);
router.put('/services/:serviceId', adminUpdateService);

router.get('/audit-logs', getAuditLogs);

module.exports = router;
