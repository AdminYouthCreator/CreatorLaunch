const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');

const formatCertificateCode = () => {
  const now = new Date();
  const year = now.getFullYear();
  const stamp = now.getTime().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 900 + 100);
  return `CL-${year}-${stamp}-${random}`;
};

const normalizeCertificate = (certificate) => {
  const item = certificate.toObject ? certificate.toObject() : certificate;

  return {
    id: item._id,
    code: item.code,
    recipientName: item.recipientName,
    recipientEmail: item.recipientEmail || '',
    certificateTitle: item.certificateTitle,
    issuedFor: item.issuedFor || '',
    description: item.description || '',
    issueDate: item.issueDate,
    issuedByName: item.issuedByName || 'CreatorLaunch Staff',
    issuedByEmail: item.issuedByEmail || 'qwentin@youthcreatorlaunch.org',
    status: item.status || 'active',
    statusReason: item.statusReason || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

const createCertificate = asyncHandler(async (req, res) => {
  const {
    recipientName,
    recipientEmail = '',
    certificateTitle,
    issuedFor = '',
    description = '',
    issueDate,
    issuedByName = 'CreatorLaunch Staff',
    issuedByEmail = 'qwentin@youthcreatorlaunch.org',
  } = req.body || {};

  if (!recipientName || !certificateTitle) {
    return res.status(400).json({
      message: 'recipientName and certificateTitle are required.',
    });
  }

  let code = formatCertificateCode();
  let exists = await Certificate.findOne({ code });

  while (exists) {
    code = formatCertificateCode();
    exists = await Certificate.findOne({ code });
  }

  const certificate = await Certificate.create({
    code,
    recipientName,
    recipientEmail,
    certificateTitle,
    issuedFor,
    description,
    issueDate: issueDate ? new Date(issueDate) : new Date(),
    issuedByName,
    issuedByEmail,
    createdBy: req.user?._id || null,
  });

  res.status(201).json({
    message: 'Certificate created successfully.',
    certificate: normalizeCertificate(certificate),
  });
});

const getAdminCertificates = asyncHandler(async (req, res) => {
  const { q = '', status = '' } = req.query;
  const query = {};

  if (status && ['active', 'revoked'].includes(status)) {
    query.status = status;
  }

  if (q) {
    query.$or = [
      { code: { $regex: q, $options: 'i' } },
      { recipientName: { $regex: q, $options: 'i' } },
      { recipientEmail: { $regex: q, $options: 'i' } },
      { certificateTitle: { $regex: q, $options: 'i' } },
      { issuedFor: { $regex: q, $options: 'i' } },
    ];
  }

  const certificates = await Certificate.find(query).sort({ createdAt: -1 }).lean();

  res.json({
    certificates: certificates.map(normalizeCertificate),
  });
});

const updateCertificateStatus = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  const { status, statusReason = '' } = req.body || {};

  if (!['active', 'revoked'].includes(status)) {
    return res.status(400).json({ message: 'Invalid certificate status.' });
  }

  const certificate = await Certificate.findById(certificateId);

  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found.' });
  }

  certificate.status = status;
  certificate.statusReason = statusReason;
  await certificate.save();

  res.json({
    message: `Certificate ${status === 'active' ? 'reactivated' : 'revoked'} successfully.`,
    certificate: normalizeCertificate(certificate),
  });
});

const verifyCertificateByCode = asyncHandler(async (req, res) => {
  const code = String(req.params.code || '').trim().toUpperCase();

  if (!code) {
    return res.status(400).json({ message: 'Certificate code is required.' });
  }

  const certificate = await Certificate.findOne({ code }).lean();

  if (!certificate) {
    return res.status(404).json({
      valid: false,
      message: 'No certificate was found with that code.',
    });
  }

  const normalized = normalizeCertificate(certificate);
  const valid = normalized.status === 'active';

  res.json({
    valid,
    message: valid
      ? 'This certificate is valid and was issued by CreatorLaunch.'
      : 'This certificate was found, but it is no longer active.',
    certificate: normalized,
  });
});

module.exports = {
  createCertificate,
  getAdminCertificates,
  updateCertificateStatus,
  verifyCertificateByCode,
};