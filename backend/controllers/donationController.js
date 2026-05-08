const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const Donation = require('../models/Donation');
const sendEmail = require('../utils/sendEmail');

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables.');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || 'http://localhost:3000';
};

const dollarsToCents = (amount) => {
  return Math.round(Number(amount) * 100);
};

const centsToDollars = (amount) => {
  return Number((Number(amount || 0) / 100).toFixed(2));
};

const createReceiptNumber = (donationId) => {
  const shortId = String(donationId).slice(-8).toUpperCase();
  const year = new Date().getFullYear();

  return `CL-${year}-${shortId}`;
};

const normalizeDonation = (donation) => {
  const obj = donation.toObject ? donation.toObject() : donation;

  return {
    id: obj._id,
    donorName: obj.anonymous ? 'Anonymous' : obj.donorName,
    donorEmail: obj.donorEmail,
    amount: obj.amount,
    currency: obj.currency,
    campaign: obj.campaign,
    message: obj.message,
    anonymous: obj.anonymous,
    recurring: obj.recurring,
    interval: obj.interval,
    paymentStatus: obj.paymentStatus,
    stripeCheckoutSessionId: obj.stripeCheckoutSessionId,
    stripeReceiptUrl: obj.stripeReceiptUrl,
    taxReceiptSent: obj.taxReceiptSent,
    taxReceiptSentAt: obj.taxReceiptSentAt,
    receiptNumber: obj.receiptNumber,
    paidAt: obj.paidAt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const buildTaxReceiptEmail = (donation) => {
  const legalName = process.env.CREATORLAUNCH_LEGAL_NAME || 'CreatorLaunch';
  const ein = process.env.CREATORLAUNCH_EIN || '';
  const taxStatusText =
    process.env.CREATORLAUNCH_TAX_STATUS_TEXT ||
    'CreatorLaunch is a tax-exempt nonprofit organization. No goods or services were provided in exchange for this contribution.';

  const donationDate = donation.paidAt || donation.createdAt || new Date();

  return `
Thank you for supporting ${legalName}.

Donation Receipt / Charitable Contribution Acknowledgement

Receipt Number: ${donation.receiptNumber || createReceiptNumber(donation._id)}
Donor Name: ${donation.donorName || 'Supporter'}
Donor Email: ${donation.donorEmail}
Donation Amount: $${Number(donation.amount || 0).toFixed(2)} ${String(donation.currency || 'usd').toUpperCase()}
Donation Date: ${new Date(donationDate).toLocaleDateString()}
Campaign: ${donation.campaign || 'General Fund'}
Donation Type: ${donation.recurring ? 'Monthly recurring donation' : 'One-time donation'}

Organization: ${legalName}
${ein ? `EIN: ${ein}` : ''}

${taxStatusText}

Please keep this receipt for your records.

With gratitude,
The CreatorLaunch Team
`.trim();
};

const sendTaxReceiptIfNeeded = async (donation) => {
  if (!donation.donorEmail || donation.taxReceiptSent || donation.paymentStatus !== 'paid') {
    return donation;
  }

  try {
    if (!donation.receiptNumber) {
      donation.receiptNumber = createReceiptNumber(donation._id);
    }

    await sendEmail({
      to: donation.donorEmail,
      subject: `Your CreatorLaunch Donation Receipt - ${donation.receiptNumber}`,
      text: buildTaxReceiptEmail(donation),
    });

    donation.taxReceiptSent = true;
    donation.taxReceiptSentAt = new Date();

    await donation.save();
  } catch (error) {
    console.error('Donation receipt email failed:', error.message);
  }

  return donation;
};

// @desc    Create Stripe Checkout session for donation
// @route   POST /api/donations/create-checkout-session
// @access  Public
exports.createCheckoutSession = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  const {
    donorName = '',
    donorEmail = '',
    amount,
    campaign = 'General Fund',
    message = '',
    anonymous = false,
    recurring = false,
  } = req.body;

  const numericAmount = Number(amount);

  if (!numericAmount || numericAmount < 1) {
    return res.status(400).json({ message: 'Donation amount must be at least $1.' });
  }

  if (!donorEmail) {
    return res.status(400).json({ message: 'Donor email is required.' });
  }

  const donation = await Donation.create({
    donorName,
    donorEmail,
    amount: numericAmount,
    campaign,
    message,
    anonymous: Boolean(anonymous),
    recurring: Boolean(recurring),
    interval: recurring ? 'month' : 'one_time',
    paymentStatus: 'pending',
  });

  const successUrl = `${getFrontendUrl()}/donate/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${getFrontendUrl()}/donate/cancel`;

  const lineItem = {
    price_data: {
      currency: 'usd',
      product_data: {
        name: `Donation to CreatorLaunch - ${campaign || 'General Fund'}`,
        description: recurring
          ? 'Monthly recurring donation supporting youth entrepreneurship.'
          : 'One-time donation supporting youth entrepreneurship.',
      },
      unit_amount: dollarsToCents(numericAmount),
      ...(recurring
        ? {
            recurring: {
              interval: 'month',
            },
          }
        : {}),
    },
    quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    mode: recurring ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    customer_email: donorEmail,
    line_items: [lineItem],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      donationId: String(donation._id),
      donorName,
      donorEmail,
      campaign,
      anonymous: String(Boolean(anonymous)),
      recurring: String(Boolean(recurring)),
    },
  });

  donation.stripeCheckoutSessionId = session.id;
  donation.stripeCustomerId = typeof session.customer === 'string' ? session.customer : '';

  await donation.save();

  res.status(200).json({
    checkoutUrl: session.url,
    sessionId: session.id,
    donation: normalizeDonation(donation),
  });
});

// @desc    Stripe webhook for donations
// @route   POST /api/donations/webhook
// @access  Public raw body
exports.handleWebhook = asyncHandler(async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ message: 'Stripe webhook secret is not configured.' });
  }

  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const donationId = session.metadata?.donationId;

      let donation = null;

      if (donationId) {
        donation = await Donation.findById(donationId);
      }

      if (!donation && session.id) {
        donation = await Donation.findOne({ stripeCheckoutSessionId: session.id });
      }

      if (donation) {
        donation.paymentStatus = 'paid';
        donation.paidAt = new Date();
        donation.stripeCheckoutSessionId = session.id;
        donation.stripePaymentIntentId =
          typeof session.payment_intent === 'string' ? session.payment_intent : '';
        donation.stripeCustomerId =
          typeof session.customer === 'string' ? session.customer : donation.stripeCustomerId;
        donation.stripeSubscriptionId =
          typeof session.subscription === 'string' ? session.subscription : '';

        if (session.amount_total) {
          donation.amount = centsToDollars(session.amount_total);
        }

        if (!donation.receiptNumber) {
          donation.receiptNumber = createReceiptNumber(donation._id);
        }

        if (!donation.rawStripeEventIds.includes(event.id)) {
          donation.rawStripeEventIds.push(event.id);
        }

        await donation.save();
        await sendTaxReceiptIfNeeded(donation);
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;

      const donation = await Donation.findOne({
        stripeCheckoutSessionId: session.id,
        paymentStatus: 'pending',
      });

      if (donation) {
        donation.paymentStatus = 'expired';

        if (!donation.rawStripeEventIds.includes(event.id)) {
          donation.rawStripeEventIds.push(event.id);
        }

        await donation.save();
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;

      const donation = await Donation.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (donation) {
        donation.paymentStatus = 'failed';

        if (!donation.rawStripeEventIds.includes(event.id)) {
          donation.rawStripeEventIds.push(event.id);
        }

        await donation.save();
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Donation webhook handling failed:', error);
    res.status(500).json({ message: 'Webhook handling failed.' });
  }
});

// @desc    Get donation by checkout session
// @route   GET /api/donations/session/:sessionId
// @access  Public
exports.getDonationBySession = asyncHandler(async (req, res) => {
  const donation = await Donation.findOne({
    stripeCheckoutSessionId: req.params.sessionId,
  });

  if (!donation) {
    return res.status(404).json({ message: 'Donation not found.' });
  }

  res.status(200).json({
    donation: normalizeDonation(donation),
  });
});

// @desc    Get donations for admin
// @route   GET /api/donations/admin
// @access  Admin
exports.getAdminDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .sort({ createdAt: -1 })
    .limit(500);

  const totalPaid = donations
    .filter((donation) => donation.paymentStatus === 'paid')
    .reduce((sum, donation) => sum + Number(donation.amount || 0), 0);

  const paidCount = donations.filter((donation) => donation.paymentStatus === 'paid').length;
  const recurringCount = donations.filter(
    (donation) => donation.paymentStatus === 'paid' && donation.recurring
  ).length;

  res.status(200).json({
    donations: donations.map(normalizeDonation),
    stats: {
      totalPaid: Number(totalPaid.toFixed(2)),
      paidCount,
      recurringCount,
      totalCount: donations.length,
    },
  });
});

// @desc    Resend donation receipt
// @route   POST /api/donations/admin/:donationId/resend-receipt
// @access  Admin
exports.resendDonationReceipt = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.donationId);

  if (!donation) {
    return res.status(404).json({ message: 'Donation not found.' });
  }

  if (donation.paymentStatus !== 'paid') {
    return res.status(400).json({ message: 'Receipt can only be sent for paid donations.' });
  }

  donation.taxReceiptSent = false;
  donation.taxReceiptSentAt = null;

  await donation.save();
  await sendTaxReceiptIfNeeded(donation);

  res.status(200).json({
    message: 'Donation receipt resent.',
    donation: normalizeDonation(donation),
  });
});