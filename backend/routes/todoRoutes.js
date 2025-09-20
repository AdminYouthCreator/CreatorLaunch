const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getTodo, updateTodo } = require('../controllers/todoController');

const router = express.Router();

router.get('/', protect, getTodo);
router.patch('/', protect, updateTodo);

module.exports = router;
