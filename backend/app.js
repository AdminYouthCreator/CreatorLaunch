const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const brandRoutes = require('./routes/brandRoutes');
const todoRoutes = require('./routes/todoRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const inviteRoutes = require('./routes/inviteRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
app.use('/static', express.static(path.join(process.cwd(), UPLOAD_DIR)));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CreatorLaunch API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/todo', todoRoutes);
app.use('/api/products', productRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/invites', inviteRoutes);

app.use(errorHandler);

module.exports = app;
