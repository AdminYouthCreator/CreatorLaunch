const express = require('express');
const {
  createCertificate,
  getAdminCertificates,
  updateCertificateStatus,
  verifyCertificateByCode,
} = require('../controllers/certificateController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/verify/:code', verifyCertificateByCode);
router.get('/admin', protect, authorizeRoles('Admin'), getAdminCertificates);
router.post('/admin', protect, authorizeRoles('Admin'), createCertificate);
router.patch('/admin/:certificateId/status', protect, authorizeRoles('Admin'), updateCertificateStatus);

module.exports = router;