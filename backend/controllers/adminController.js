const asyncHandler = require('express-async-handler');

const User = require('../models/User');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Todo = require('../models/Todo');

let Invite = null;

try {
  Invite = require('../models/Invite');
} catch (error) {
  Invite = null;
}

const getStartDate = (range = '30d') => {
  const now = new Date();

  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case '30d':
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
};

const buildDateBuckets = (startDate, endDate = new Date()) => {
  const buckets = [];
  const cursor = new Date(startDate);

  cursor.setHours(0, 0, 0, 0);

  while (cursor <= endDate) {
    const key = cursor.toISOString().slice(0, 10);

    buckets.push({
      date: key,
      count: 0,
      amount: 0,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return buckets;
};

const groupCountByDate = (docs, startDate) => {
  const buckets = buildDateBuckets(startDate);
  const map = new Map(buckets.map((bucket) => [bucket.date, bucket]));

  docs.forEach((doc) => {
    const date = new Date(doc.createdAt).toISOString().slice(0, 10);
    const bucket = map.get(date);

    if (bucket) {
      bucket.count += 1;
    }
  });

  return Array.from(map.values()).map((bucket) => ({
    date: bucket.date,
    count: bucket.count,
  }));
};

const groupRevenueByDate = (orders, startDate) => {
  const buckets = buildDateBuckets(startDate);
  const map = new Map(buckets.map((bucket) => [bucket.date, bucket]));

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().slice(0, 10);
    const bucket = map.get(date);

    if (bucket) {
      bucket.amount += Number(order.total || 0);
    }
  });

  return Array.from(map.values()).map((bucket) => ({
    date: bucket.date,
    amount: Number(bucket.amount.toFixed(2)),
  }));
};

const getUserAge = (dob) => {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
};

const normalizeUser = (user, brandMap, todoMap) => {
  const brand = brandMap.get(String(user._id));
  const todo = todoMap.get(String(user._id));
  const age = getUserAge(user.dob);
  const accountStatus = user.accountStatus || 'active';

  return {
    id: user._id,
    name: user.username,
    email: user.email,
    role: user.role,
    status: accountStatus,
    accountStatus,
    accountStatusReason: user.accountStatusReason || '',
    accountStatusUpdatedAt: user.accountStatusUpdatedAt || null,
    forcePasswordReset: Boolean(user.forcePasswordReset),
    adminNotes: user.adminNotes || '',
    registrationDate: user.createdAt,
    lastLogin: null,
    storeCount: brand ? 1 : 0,
    hasCompletedOnboarding: Boolean(todo?.brandCreated || brand),
    guardianEmail: user.parentEmail || '',
    isMinor: typeof age === 'number' ? age < 18 : false,
    age,
    emailVerified: user.emailVerified,
    invitedByCode: user.invitedByCode || null,
  };
};

const normalizeProduct = (product) => {
  const obj = product.toObject ? product.toObject() : product;
  const firstVariant = obj.variants?.[0] || {};

  const price =
    Number(obj.price) ||
    Number(obj.retailPrice) ||
    Number(firstVariant.retailPrice) ||
    Number(firstVariant.price) ||
    0;

  const imageUrl =
    obj.imageUrl ||
    obj.image ||
    obj.thumbnail ||
    obj.mockupUrl ||
    firstVariant.mockupUrl ||
    firstVariant.imageUrl ||
    '';

  return {
    id: obj._id,
    name: obj.name || 'Untitled Product',
    description: obj.description || '',
    status: obj.status || 'published',
    price,
    retailPrice: price,
    imageUrl,
    mockupUrl: imageUrl,
    variants: obj.variants || [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    brand: obj.brand
      ? {
          id: obj.brand._id || obj.brand,
          name: obj.brand.brandName || 'Unknown Store',
          subdomain: obj.brand.subdomain || '',
          status: obj.brand.status || 'active',
          owner: obj.brand.user
            ? {
                id: obj.brand.user._id || obj.brand.user,
                name: obj.brand.user.username || 'Unknown Creator',
                email: obj.brand.user.email || '',
                accountStatus: obj.brand.user.accountStatus || 'active',
              }
            : null,
        }
      : null,
  };
};

const normalizeService = (service) => {
  const obj = service.toObject ? service.toObject() : service;

  return {
    id: obj._id,
    title: obj.title || 'Untitled Service',
    description: obj.description || '',
    category: obj.category || 'other',
    price: Number(obj.price || 0),
    deliveryTime: obj.deliveryTime || '',
    revisions: Number(obj.revisions || 0),
    requirements: obj.requirements || '',
    status: obj.status || 'draft',
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    brand: obj.brand
      ? {
          id: obj.brand._id || obj.brand,
          name: obj.brand.brandName || 'Unknown Store',
          subdomain: obj.brand.subdomain || '',
          status: obj.brand.status || 'active',
          owner: obj.brand.user
            ? {
                id: obj.brand.user._id || obj.brand.user,
                name: obj.brand.user.username || 'Unknown Creator',
                email: obj.brand.user.email || '',
                accountStatus: obj.brand.user.accountStatus || 'active',
              }
            : null,
        }
      : null,
  };
};

const normalizeStore = async (brand) => {
  const [productCount, serviceCount, orders] = await Promise.all([
    Product.countDocuments({ brand: brand._id }),
    Service.countDocuments({ brand: brand._id }),
    Order.find({ brand: brand._id, paymentStatus: 'paid' }).select('total createdAt'),
  ]);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyRevenue = orders
    .filter((order) => new Date(order.createdAt) >= monthStart)
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  return {
    id: brand._id,
    name: brand.brandName,
    url: brand.subdomain,
    description: brand.description || '',
    logoUrl: brand.logoUrl || null,
    owner: {
      id: brand.user?._id || brand.user,
      name: brand.user?.username || 'Unknown Creator',
      email: brand.user?.email || '',
      accountStatus: brand.user?.accountStatus || 'active',
    },
    status: brand.status || 'active',
    statusReason: brand.statusReason || '',
    adminNotes: brand.adminNotes || '',
    createdDate: brand.createdAt,
    lastActivity: brand.updatedAt || brand.createdAt,
    productCount,
    serviceCount,
    totalSales: Number(totalSales.toFixed(2)),
    monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
    category: 'Creator Store',
    isApproved: brand.status === 'active',
  };
};

const buildRecentActivity = async () => {
  const [users, brands, products, orders] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(5).select('username email createdAt'),
    Brand.find().sort({ createdAt: -1 }).limit(5).populate('user', 'username email'),
    Product.find().sort({ createdAt: -1 }).limit(5).populate('brand', 'brandName subdomain'),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('brand', 'brandName subdomain'),
  ]);

  const activity = [];

  users.forEach((user) => {
    activity.push({
      id: `user-${user._id}`,
      type: 'user_registration',
      description: `New user registered: ${user.email}`,
      timestamp: user.createdAt,
      user: user.email,
      status: 'success',
    });
  });

  brands.forEach((brand) => {
    activity.push({
      id: `store-${brand._id}`,
      type: 'store_creation',
      description: `New store created: ${brand.brandName}`,
      timestamp: brand.createdAt,
      user: brand.user?.email || '',
      status: 'success',
    });
  });

  products.forEach((product) => {
    activity.push({
      id: `product-${product._id}`,
      type: 'product_created',
      description: `Product added: ${product.name}`,
      timestamp: product.createdAt,
      user: product.brand?.brandName || '',
      status: 'success',
    });
  });

  orders.forEach((order) => {
    activity.push({
      id: `order-${order._id}`,
      type: 'order_placed',
      description: `Order ${order.orderNumber} placed - $${Number(order.total || 0).toFixed(2)}`,
      timestamp: order.createdAt,
      user: order.brand?.brandName || '',
      status: order.paymentStatus === 'paid' ? 'success' : 'warning',
    });
  });

  return activity
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 12);
};

exports.getOverview = asyncHandler(async (req, res) => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    verifiedUsers,
    restrictedUsers,
    totalStores,
    restrictedStores,
    totalProducts,
    totalServices,
    paidOrders,
    monthlyPaidOrders,
    pendingInvites,
    recentActivity,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ emailVerified: true }),
    User.countDocuments({ accountStatus: { $in: ['suspended', 'banned', 'locked'] } }),
    Brand.countDocuments(),
    Brand.countDocuments({ status: { $in: ['locked', 'hidden', 'suspended', 'under_review'] } }),
    Product.countDocuments(),
    Service.countDocuments(),
    Order.find({ paymentStatus: 'paid' }).select('total'),
    Order.find({ paymentStatus: 'paid', createdAt: { $gte: monthStart } }).select('total'),
    Invite ? Invite.countDocuments({ status: 'active' }) : Promise.resolve(0),
    buildRecentActivity(),
  ]);

  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const monthlyRevenue = monthlyPaidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  res.status(200).json({
    stats: {
      totalUsers,
      activeUsers: verifiedUsers,
      restrictedUsers,
      totalStores,
      activeStores: Math.max(totalStores - restrictedStores, 0),
      restrictedStores,
      totalProducts,
      totalServices,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
      pendingApprovals: pendingInvites,
      systemAlerts: restrictedUsers + restrictedStores,
    },
    recentActivity,
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const [users, brands, todos] = await Promise.all([
    User.find().sort({ createdAt: -1 }).select('-password'),
    Brand.find().select('user brandName subdomain'),
    Todo.find(),
  ]);

  const brandMap = new Map(brands.map((brand) => [String(brand.user), brand]));
  const todoMap = new Map(todos.map((todo) => [String(todo.user), todo]));

  res.status(200).json({
    users: users.map((user) => normalizeUser(user, brandMap, todoMap)),
  });
});

exports.getStores = asyncHandler(async (req, res) => {
  const brands = await Brand.find()
    .sort({ createdAt: -1 })
    .populate('user', 'username email role accountStatus');

  const stores = await Promise.all(brands.map((brand) => normalizeStore(brand)));

  res.status(200).json({ stores });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'brand',
      select: 'brandName subdomain status user',
      populate: {
        path: 'user',
        select: 'username email accountStatus',
      },
    });

  res.status(200).json({
    products: products.map(normalizeProduct),
  });
});

exports.getServices = asyncHandler(async (req, res) => {
  const services = await Service.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'brand',
      select: 'brandName subdomain status user',
      populate: {
        path: 'user',
        select: 'username email accountStatus',
      },
    });

  res.status(200).json({
    services: services.map(normalizeService),
  });
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  const range = req.query.range || '30d';
  const startDate = getStartDate(range);

  const [
    users,
    brands,
    products,
    services,
    orders,
    totalUsers,
    totalStores,
    totalOrders,
    allPaidOrders,
  ] = await Promise.all([
    User.find({ createdAt: { $gte: startDate } }).select('createdAt dob'),
    Brand.find({ createdAt: { $gte: startDate } }).select('createdAt'),
    Product.find().populate('brand', 'brandName subdomain'),
    Service.find().populate('brand', 'brandName subdomain'),
    Order.find({ createdAt: { $gte: startDate } }).select('createdAt total paymentStatus'),
    User.countDocuments(),
    Brand.countDocuments(),
    Order.countDocuments(),
    Order.find({ paymentStatus: 'paid' }).select('total'),
  ]);

  const paidOrdersInRange = orders.filter((order) => order.paymentStatus === 'paid');
  const totalRevenue = allPaidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const ageGroups = {
    'Under 13': 0,
    '13-15': 0,
    '16-17': 0,
    '18+': 0,
    Unknown: 0,
  };

  const allUsers = await User.find().select('dob');

  allUsers.forEach((user) => {
    const age = getUserAge(user.dob);

    if (age === null) ageGroups.Unknown += 1;
    else if (age < 13) ageGroups['Under 13'] += 1;
    else if (age <= 15) ageGroups['13-15'] += 1;
    else if (age <= 17) ageGroups['16-17'] += 1;
    else ageGroups['18+'] += 1;
  });

  const ageTotal = Object.values(ageGroups).reduce((sum, value) => sum + value, 0) || 1;

  const productStatusCounts = products.reduce((acc, product) => {
    const status = product.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const serviceCategoryCounts = services.reduce((acc, service) => {
    const category = service.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json({
    overview: {
      totalUsers,
      totalStores,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts: products.length,
      totalServices: services.length,
      userGrowth: users.length,
      storeGrowth: brands.length,
      revenueGrowth: Number(
        paidOrdersInRange.reduce((sum, order) => sum + Number(order.total || 0), 0).toFixed(2)
      ),
      orderGrowth: orders.length,
    },
    chartData: {
      userRegistrations: groupCountByDate(users, startDate),
      storeCreations: groupCountByDate(brands, startDate),
      revenue: groupRevenueByDate(paidOrdersInRange, startDate),
      orders: groupCountByDate(orders, startDate),
    },
    demographics: {
      ageGroups: Object.entries(ageGroups).map(([label, value]) => ({
        label,
        value,
        percent: Math.round((value / ageTotal) * 100),
      })),
      productStatuses: Object.entries(productStatusCounts).map(([status, count]) => ({
        status,
        count,
      })),
      serviceCategories: Object.entries(serviceCategoryCounts).map(([category, count]) => ({
        category,
        count,
      })),
    },
  });
});
