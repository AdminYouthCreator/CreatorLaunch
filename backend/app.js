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
const adminRoutes = require('./routes/adminRoutes');
const adminModerationRoutes = require('./routes/adminModerationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminBlogRoutes = require('./routes/adminBlogRoutes');
const errorHandler = require('./middlewares/errorHandler');
const settingsRoutes = require('./routes/settingsRoutes');
const adminSettingsRoutes = require('./routes/adminSettingsRoutes');
const donationRoutes = require('./routes/donationRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const toolSubmissionRoutes = require('./routes/toolSubmissionRoutes');
const donationController = require('./controllers/donationController');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://creatorlaunch-frontend.onrender.com',
  'https://youthcreatorlaunch.org',
  'https://www.youthcreatorlaunch.org',
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.post(
  '/api/donations/webhook',
  express.raw({ type: 'application/json' }),
  donationController.handleWebhook
);
app.use(express.json({ limit: '25mb' }));
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
app.use('/api/admin', adminRoutes);
app.use('/api/admin/moderation', adminModerationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin/blog', adminBlogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/tools', toolSubmissionRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found.',
    path: req.originalUrl,
  });
});

app.use(errorHandler);

module.exports = app;