const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const ProgramUser = require('../models/ProgramUser');
const ProgramPurchaseRequest = require('../models/ProgramPurchaseRequest');
const ProgramCard = require('../models/ProgramCard');
const User = require('../models/User');
const { getBusinessProgramSecret } = require('../middlewares/businessProgramAuth');
const { uploadProgramReceipt } = require('../services/programReceiptService');

const SPENDING_WARNING_THRESHOLD = 290;

const receiptUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error('Receipts must be a PDF, PNG, JPG, or WebP file.'), false);
    }
    callback(null, true);
  },
}).single('receipt');

const runReceiptUpload = (req, res, next) => {
  receiptUpload(req, res, (error) => {
    if (error) return res.status(400).json({ message: error.message });
    next();
  });
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const issueToken = (programUser) =>
  jwt.sign(
    {
      programUserId: programUser._id,
      role: programUser.role,
      scope: 'business-program',
    },
    getBusinessProgramSecret(),
    { expiresIn: '12h' },
  );

const publicProgramUser = (user, includeStaffFields = false) => {
  const result = {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    forcePasswordReset: Boolean(user.forcePasswordReset),
    creatorResourceEmail: user.creatorResourceEmail || '',
  };

  if (includeStaffFields) {
    result.budgetLimit = Number(user.budgetLimit || 0);
    result.assignedCoach = user.assignedCoach
      ? {
          id: String(user.assignedCoach._id || user.assignedCoach),
          name: user.assignedCoach.name || '',
          email: user.assignedCoach.email || '',
        }
      : null;
  }

  return result;
};

const serializeRequest = (request) => ({
  id: String(request._id),
  student: {
    id: String(request.student._id || request.student),
    name: request.student.name || '',
    email: request.student.email || '',
  },
  vendor: request.vendor,
  item: request.item,
  description: request.description,
  amount: request.amount,
  purchaseType: request.purchaseType,
  status: request.status,
  reviewNote: request.reviewNote || '',
  reviewedBy: request.reviewedBy
    ? {
        id: String(request.reviewedBy._id || request.reviewedBy),
        name: request.reviewedBy.name || '',
      }
    : null,
  reviewedAt: request.reviewedAt,
  receipt: request.receipt
    ? {
        fileName: request.receipt.fileName,
        url: request.receipt.url,
        uploadedAt: request.receipt.uploadedAt,
      }
    : null,
  createdAt: request.createdAt,
});

const serializeCard = (card) => ({
  id: String(card._id),
  student: {
    id: String(card.student._id || card.student),
    name: card.student.name || '',
  },
  nickname: card.nickname,
  lastFour: card.lastFour,
  status: card.status,
  issuedAt: card.issuedAt,
});

const getAccessibleStudents = async (programUser) => {
  if (programUser.role === 'admin') {
    return ProgramUser.find({ role: 'student' }).populate('assignedCoach', 'name email');
  }

  if (programUser.role === 'coach') {
    return ProgramUser.find({ role: 'student', assignedCoach: programUser._id }).populate(
      'assignedCoach',
      'name email',
    );
  }

  return ProgramUser.find({ _id: programUser._id, role: 'student' });
};

const isCoachForStudent = (coach, student) =>
  coach.role === 'coach' &&
  student.assignedCoach &&
  String(student.assignedCoach) === String(coach._id);

exports.login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  let programUser = await ProgramUser.findOne({ email }).select('+password');

  // An existing CreatorLaunch administrator may bootstrap the first program-admin account.
  if (!programUser) {
    const originalAdmin = await User.findOne({ email, role: 'Admin' }).select('+password');
    if (originalAdmin && (await bcrypt.compare(password, originalAdmin.password))) {
      programUser = await ProgramUser.create({
        name: originalAdmin.username || 'Program administrator',
        email,
        password,
        role: 'admin',
        forcePasswordReset: false,
        budgetLimit: 0,
      });
      programUser = await ProgramUser.findById(programUser._id).select('+password');
    }
  }

  if (!programUser || !(await programUser.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid Business Program credentials.' });
  }

  if (programUser.status !== 'active') {
    return res.status(403).json({ message: 'This program account is inactive.' });
  }

  res.json({
    token: issueToken(programUser),
    user: publicProgramUser(programUser, programUser.role !== 'student'),
  });
});

exports.me = asyncHandler(async (req, res) => {
  const populated = await ProgramUser.findById(req.programUser._id).populate(
    'assignedCoach',
    'name email',
  );
  res.json({ user: publicProgramUser(populated, populated.role !== 'student') });
});

exports.dashboard = asyncHandler(async (req, res) => {
  const students = await getAccessibleStudents(req.programUser);
  const studentIds = students.map((student) => student._id);

  const [requests, cards] = await Promise.all([
    ProgramPurchaseRequest.find({ student: { $in: studentIds } })
      .populate('student', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 }),
    ProgramCard.find({ student: { $in: studentIds } })
      .populate('student', 'name')
      .sort({ issuedAt: -1 }),
  ]);

  const approvedByStudent = new Map();
  requests.forEach((request) => {
    if (request.status !== 'approved') return;
    const studentId = String(request.student._id || request.student);
    approvedByStudent.set(studentId, (approvedByStudent.get(studentId) || 0) + request.amount);
  });

  const studentSummaries = students.map((student) => {
    const approvedSpend = Number((approvedByStudent.get(String(student._id)) || 0).toFixed(2));
    return {
      ...publicProgramUser(student, true),
      approvedSpend,
      remainingBudget: Number(Math.max(0, student.budgetLimit - approvedSpend).toFixed(2)),
      spendingWarning: approvedSpend >= SPENDING_WARNING_THRESHOLD,
    };
  });

  const base = {
    requests: requests.map(serializeRequest),
    cards: cards.map(serializeCard),
    warningThreshold: SPENDING_WARNING_THRESHOLD,
  };

  if (req.programUser.role === 'student') {
    return res.json({
      ...base,
      // Deliberately omit budget limits, approved totals, and remaining balances from students.
      students: [],
      accounts: [],
      stats: {
        pendingRequests: requests.filter((request) => request.status === 'pending').length,
        approvedRequests: requests.filter((request) => request.status === 'approved').length,
        receiptsNeeded: requests.filter(
          (request) => request.status === 'approved' && !request.receipt,
        ).length,
      },
    });
  }

  let accounts = studentSummaries;
  if (req.programUser.role === 'admin') {
    const allAccounts = await ProgramUser.find().populate('assignedCoach', 'name email').sort({ name: 1 });
    accounts = allAccounts.map((account) => publicProgramUser(account, true));
  }

  res.json({
    ...base,
    students: studentSummaries,
    accounts,
    stats: {
      activeStudents: students.filter((student) => student.status === 'active').length,
      pendingRequests: requests.filter((request) => request.status === 'pending').length,
      approvedSpend: Number(
        requests
          .filter((request) => request.status === 'approved')
          .reduce((sum, request) => sum + request.amount, 0)
          .toFixed(2),
      ),
      activeCards: cards.filter((card) => card.status === 'active').length,
    },
  });
});

exports.createAccount = asyncHandler(async (req, res) => {
  const { name, role, assignedCoach, creatorResourceEmail } = req.body;
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  const budgetLimit = Number(req.body.budgetLimit ?? 300);

  if (!name || !email || !['admin', 'coach', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Name, email, and a valid role are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Temporary passwords must be at least 8 characters.' });
  }
  if (await ProgramUser.exists({ email })) {
    return res.status(409).json({ message: 'A program account already uses this email.' });
  }

  let coachId = null;
  if (role === 'student' && assignedCoach) {
    const coach = await ProgramUser.findOne({ _id: assignedCoach, role: 'coach', status: 'active' });
    if (!coach) return res.status(400).json({ message: 'Select an active coach.' });
    coachId = coach._id;
  }

  const account = await ProgramUser.create({
    name: String(name).trim(),
    email,
    password,
    role,
    assignedCoach: coachId,
    budgetLimit: role === 'student' && Number.isFinite(budgetLimit) ? budgetLimit : 0,
    creatorResourceEmail: normalizeEmail(creatorResourceEmail),
    createdBy: req.programUser._id,
  });

  const populated = await ProgramUser.findById(account._id).populate('assignedCoach', 'name email');
  res.status(201).json({ account: publicProgramUser(populated, true) });
});

exports.createRequest = asyncHandler(async (req, res) => {
  const { vendor, item, description } = req.body;
  const amount = Number(req.body.amount);
  const purchaseType = req.body.purchaseType === 'recurring' ? 'recurring' : 'one-time';

  if (!vendor || !item || !description || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Vendor, item, purpose, and a valid amount are required.' });
  }

  const request = await ProgramPurchaseRequest.create({
    student: req.programUser._id,
    vendor: String(vendor).trim(),
    item: String(item).trim(),
    description: String(description).trim(),
    amount,
    purchaseType,
  });

  await request.populate('student', 'name email');
  res.status(201).json({
    request: serializeRequest(request),
    warnings:
      purchaseType === 'recurring'
        ? ['Recurring subscriptions are discouraged and require an explicit staff review.']
        : [],
  });
});

exports.reviewRequest = asyncHandler(async (req, res) => {
  const decision = req.body.status;
  if (!['approved', 'denied'].includes(decision)) {
    return res.status(400).json({ message: 'Choose approved or denied.' });
  }

  const request = await ProgramPurchaseRequest.findById(req.params.requestId).populate(
    'student',
  );
  if (!request) return res.status(404).json({ message: 'Purchase request not found.' });

  if (
    req.programUser.role === 'coach' &&
    !isCoachForStudent(req.programUser, request.student)
  ) {
    return res.status(403).json({ message: 'This student is not assigned to you.' });
  }

  const warnings = [];
  if (decision === 'approved') {
    if (request.purchaseType === 'recurring' && req.body.acknowledgeRecurring !== true) {
      return res.status(400).json({
        message: 'Confirm that this recurring subscription is necessary before approval.',
        recurringConfirmationRequired: true,
      });
    }

    const approvedBefore = await ProgramPurchaseRequest.aggregate([
      {
        $match: {
          student: request.student._id,
          status: 'approved',
          _id: { $ne: request._id },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const currentApproved = approvedBefore[0]?.total || 0;
    const nextApproved = currentApproved + request.amount;

    if (nextApproved > request.student.budgetLimit) {
      return res.status(400).json({
        message: `Approval would exceed this student’s $${request.student.budgetLimit.toFixed(2)} budget.`,
      });
    }
    if (nextApproved >= SPENDING_WARNING_THRESHOLD) {
      warnings.push(`Approved spending is now $${nextApproved.toFixed(2)}, at or above the $${SPENDING_WARNING_THRESHOLD} warning level.`);
    }
  }

  request.status = decision;
  request.reviewNote = String(req.body.reviewNote || '').trim();
  request.reviewedBy = req.programUser._id;
  request.reviewedAt = new Date();
  await request.save();

  await request.populate('student', 'name email');
  await request.populate('reviewedBy', 'name');
  res.json({ request: serializeRequest(request), warnings });
});

exports.uploadReceipt = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose a receipt file.' });

  const request = await ProgramPurchaseRequest.findOne({
    _id: req.params.requestId,
    student: req.programUser._id,
  }).populate('student', 'name email');

  if (!request) return res.status(404).json({ message: 'Purchase request not found.' });
  if (request.status !== 'approved') {
    return res.status(400).json({ message: 'Receipts can be added after a request is approved.' });
  }

  const uploaded = await uploadProgramReceipt(req.file);
  request.receipt = {
    fileName: req.file.originalname,
    url: uploaded.url,
    publicId: uploaded.publicId,
    uploadedAt: new Date(),
  };
  await request.save();

  res.json({ request: serializeRequest(request) });
});

exports.issueCard = asyncHandler(async (req, res) => {
  const { studentId, nickname } = req.body;
  const lastFour = String(req.body.lastFour || '').trim();

  const student = await ProgramUser.findOne({ _id: studentId, role: 'student', status: 'active' });
  if (!student) return res.status(400).json({ message: 'Select an active student.' });
  if (!/^\d{4}$/.test(lastFour)) {
    return res.status(400).json({ message: 'Enter the card’s last four digits.' });
  }

  await ProgramCard.updateMany(
    { student: student._id, status: 'active' },
    { $set: { status: 'replaced' } },
  );

  const card = await ProgramCard.create({
    student: student._id,
    nickname: String(nickname || 'Program card').trim(),
    lastFour,
    issuedBy: req.programUser._id,
  });
  await card.populate('student', 'name');

  res.status(201).json({ card: serializeCard(card) });
});

exports.updateCardStatus = asyncHandler(async (req, res) => {
  const status = req.body.status;
  if (!['active', 'frozen', 'replaced'].includes(status)) {
    return res.status(400).json({ message: 'Choose a valid card status.' });
  }

  const card = await ProgramCard.findByIdAndUpdate(
    req.params.cardId,
    { $set: { status } },
    { new: true, runValidators: true },
  ).populate('student', 'name');
  if (!card) return res.status(404).json({ message: 'Card not found.' });

  res.json({ card: serializeCard(card) });
});

const csvCell = (value) => {
  let output = String(value ?? '');
  if (/^[=+\-@]/.test(output)) output = `'${output}`;
  return `"${output.replace(/"/g, '""')}"`;
};

exports.downloadReport = asyncHandler(async (_req, res) => {
  const students = await ProgramUser.find({ role: 'student' }).populate('assignedCoach', 'name');
  const approved = await ProgramPurchaseRequest.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$student', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  const totals = new Map(approved.map((row) => [String(row._id), row]));

  const rows = [
    ['Student', 'Email', 'Coach', 'Budget', 'Approved spending', 'Remaining', 'Approved requests', 'Warning'],
    ...students.map((student) => {
      const total = totals.get(String(student._id)) || { total: 0, count: 0 };
      const remaining = Math.max(0, student.budgetLimit - total.total);
      return [
        student.name,
        student.email,
        student.assignedCoach?.name || 'Unassigned',
        student.budgetLimit.toFixed(2),
        total.total.toFixed(2),
        remaining.toFixed(2),
        total.count,
        total.total >= SPENDING_WARNING_THRESHOLD ? 'Near spending limit' : '',
      ];
    }),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="creatorlaunch-program-report-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

exports.runReceiptUpload = runReceiptUpload;
