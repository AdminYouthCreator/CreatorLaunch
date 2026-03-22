const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  itemType: {
    type: String,
    enum: ['product', 'service'],
    required: true
  },
  name: { type: String, required: true },
  variant: {
    size: String,
    color: String,
    printfulVariantId: Number
  },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  baseCost: { type: Number, default: 0 },
  mockupUrl: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      zip: String,
      country: { type: String, default: 'US' }
    }
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
    index: true
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  profit: { type: Number, default: 0 },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  fulfillmentStatus: {
    type: String,
    enum: ['unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'unfulfilled'
  },
  printfulOrderId: Number,
  trackingNumber: String,
  trackingUrl: String,
  notes: String
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('validate', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `CL-${String(count + 1001).padStart(6, '0')}`;
  }
  next();
});

// Calculate profit
orderSchema.pre('save', function (next) {
  if (this.isModified('items') || this.isNew) {
    const totalBaseCost = this.items.reduce((sum, item) => {
      return sum + (item.baseCost * item.quantity);
    }, 0);
    this.profit = this.subtotal - totalBaseCost;
  }
  next();
});

orderSchema.index({ 'buyer.email': 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
