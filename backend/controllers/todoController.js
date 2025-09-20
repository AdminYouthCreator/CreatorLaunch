const Todo = require('../models/Todo');

// GET /api/todo
exports.getTodo = async (req, res, next) => {
  try {
    let todo = await Todo.findOne({ user: req.user._id });
    if (!todo) {
      todo = await Todo.create({ user: req.user._id });
    }
    res.json({ todo });
  } catch (err) { next(err); }
};

// PATCH /api/todo  
exports.updateTodo = async (req, res, next) => {
  try {
    const allowed = ['signupCompleted','brandCreated','productCreated','firstSale'];
    const payload = {};
    for (const key of allowed) {
      if (typeof req.body[key] === 'boolean') payload[key] = req.body[key];
    }
    if (!Object.keys(payload).length) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    const todo = await Todo.findOneAndUpdate(
      { user: req.user._id },
      { $set: payload },
      { new: true, upsert: true }
    );
    res.json({ todo });
  } catch (err) { next(err); }
};
