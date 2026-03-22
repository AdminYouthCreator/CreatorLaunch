const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Brand = require('../models/Brand');

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to your .env file.');
  }
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// @desc    Create a Stripe checkout session
// @route   POST /api/checkout/create-session
// @access  Public
exports.createCheckoutSession = asyncHandler(async (req, res) => {
  const { items, brandId, buyer } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const brand = await Brand.findById(brandId);
  if (!brand) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        ...(item.variant?.size && { description: `Size: ${item.variant.size}` }),
        ...(item.mockupUrl && { images: [item.mockupUrl] })
      },
      unit_amount: Math.round(item.unitPrice * 100)
    },
    quantity: item.quantity
  }));

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    customer_email: buyer?.email,
    metadata: {
      brandId: brandId,
      buyerName: buyer?.name || '',
      buyerEmail: buyer?.email || ''
    }
  });

  res.status(200).json({ sessionId: session.id, url: session.url });
});

// @desc    Handle Stripe webhook events
// @route   POST /api/checkout/webhook
// @access  Public (Stripe signature verified)
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      await Order.create({
        buyer: {
          email: session.customer_email || session.metadata.buyerEmail,
          name: session.metadata.buyerName || 'Customer'
        },
        brand: session.metadata.brandId,
        items: [],
        subtotal: session.amount_total / 100,
        total: session.amount_total / 100,
        stripePaymentIntentId: session.payment_intent,
        paymentStatus: 'paid'
      });
    } catch (err) {
      console.error('Error creating order from webhook:', err.message);
    }
  }

  res.status(200).json({ received: true });
};

// @desc    Get checkout session status
// @route   GET /api/checkout/session/:sessionId
// @access  Public
exports.getSessionStatus = asyncHandler(async (req, res) => {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

  res.status(200).json({
    status: session.payment_status,
    customerEmail: session.customer_email
  });
});
