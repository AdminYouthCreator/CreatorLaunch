const express = require('express');

const {
  getPublicPosts,
  getPublicPostBySlug,
} = require('../controllers/blogController');

const router = express.Router();

router.get('/', getPublicPosts);
router.get('/:slug', getPublicPostBySlug);

module.exports = router;
