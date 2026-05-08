const express = require('express');

const {
  getAdminPosts,
  getAdminPostById,
  createAdminPost,
  updateAdminPost,
  archiveAdminPost,
} = require('../controllers/adminBlogController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Admin'));

router.get('/', getAdminPosts);
router.post('/', createAdminPost);
router.get('/:postId', getAdminPostById);
router.put('/:postId', updateAdminPost);
router.delete('/:postId', archiveAdminPost);

module.exports = router;
