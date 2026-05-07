const express = require('express');
const {
  getInvites,
  createInvite,
  revokeInvite,
} = require('../controllers/inviteController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Admin'));

router.get('/', getInvites);
router.post('/', createInvite);
router.patch('/:inviteId/revoke', revokeInvite);

module.exports = router;
