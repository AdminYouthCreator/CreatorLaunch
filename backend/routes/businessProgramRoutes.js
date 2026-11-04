const express = require('express');
const controller = require('../controllers/businessProgramController');
const {
  protectBusinessProgram,
  authorizeProgramRoles,
} = require('../middlewares/businessProgramAuth');

const router = express.Router();

router.post('/auth/login', controller.login);
router.get('/me', protectBusinessProgram, controller.me);
router.get('/dashboard', protectBusinessProgram, controller.dashboard);

router.post(
  '/accounts',
  protectBusinessProgram,
  authorizeProgramRoles('admin'),
  controller.createAccount,
);

router.post(
  '/requests',
  protectBusinessProgram,
  authorizeProgramRoles('student'),
  controller.createRequest,
);
router.patch(
  '/requests/:requestId/review',
  protectBusinessProgram,
  authorizeProgramRoles('admin', 'coach'),
  controller.reviewRequest,
);
router.post(
  '/requests/:requestId/receipt',
  protectBusinessProgram,
  authorizeProgramRoles('student'),
  controller.runReceiptUpload,
  controller.uploadReceipt,
);

router.post(
  '/cards',
  protectBusinessProgram,
  authorizeProgramRoles('admin'),
  controller.issueCard,
);
router.patch(
  '/cards/:cardId/status',
  protectBusinessProgram,
  authorizeProgramRoles('admin'),
  controller.updateCardStatus,
);

router.get(
  '/reports/spending.csv',
  protectBusinessProgram,
  authorizeProgramRoles('admin'),
  controller.downloadReport,
);

module.exports = router;
