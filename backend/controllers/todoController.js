const Todo = require('../models/Todo');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

// ################## ----- HELPERS ----- ##################

const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

const applyComputedTodoStatus = async (req, todo) => {
  const userId = getUserId(req);

  const userBrands = await Brand.find({ user: userId }).select('_id');
  const brandIds = userBrands.map((brand) => brand._id);

  const hasBrand = brandIds.length > 0;
  const hasProduct = await Product.exists({ brand: { $in: brandIds } });

  const todoObject = todo.toObject ? todo.toObject() : todo;

  return {
    ...todoObject,

    // Main fields your onboarding likely uses
    signupCompleted: true,
    brandCreated: Boolean(todoObject.brandCreated || hasBrand),
    productCreated: Boolean(todoObject.productCreated || hasProduct),
    firstSale: Boolean(todoObject.firstSale),

    // Extra aliases in case any frontend component checks these names
    firstProductCreated: Boolean(todoObject.firstProductCreated || hasProduct),
    createProduct: Boolean(todoObject.createProduct || hasProduct),
    productStepCompleted: Boolean(todoObject.productStepCompleted || hasProduct),
  };
};

// GET /api/todo
exports.getTodo = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    let todo = await Todo.findOne({ user: userId });

    if (!todo) {
      todo = await Todo.create({
        user: userId,
        signupCompleted: true,
      });
    }

    const computedTodo = await applyComputedTodoStatus(req, todo);

    res.json({ todo: computedTodo });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/todo
exports.updateTodo = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const allowed = [
      'signupCompleted',
      'brandCreated',
      'productCreated',
      'firstSale',
      'firstProductCreated',
      'createProduct',
      'productStepCompleted',
    ];

    const payload = {};

    for (const key of allowed) {
      if (typeof req.body[key] === 'boolean') {
        payload[key] = req.body[key];
      }
    }

    if (!Object.keys(payload).length) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const todo = await Todo.findOneAndUpdate(
      { user: userId },
      { $set: payload },
      { new: true, upsert: true }
    );

    const computedTodo = await applyComputedTodoStatus(req, todo);

    res.json({ todo: computedTodo });
  } catch (err) {
    next(err);
  }
};
