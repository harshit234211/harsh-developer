const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../config/env');
const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

const UPLOADS_DIR = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `${baseName}_${Date.now()}${ext}`;
    cb(null, safeName);
  }
});

// File filter for APK, EXE, ZIP, PDF, TAR, DMG, MSI, PKG
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.apk', '.exe', '.zip', '.pdf', '.msi', '.dmg', '.tar', '.gz', '.pkg', '.bin'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) || file.mimetype.includes('octet-stream') || file.mimetype.includes('zip')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}. Allowed types: APK, EXE, ZIP, PDF, MSI, DMG, TAR.`));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: fileFilter
});

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Generate HMAC signed temporary download token
 */
function createDownloadToken(orderId, productId, email) {
  const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  const payload = `${orderId}:${productId}:${email}:${expiry}`;
  const sig = crypto.createHmac('sha256', config.jwtSecret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

/**
 * Verify HMAC signed download token
 */
function verifyDownloadToken(tokenStr, orderId, productId) {
  try {
    const decoded = Buffer.from(tokenStr, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 5) return false;
    const [tOrderId, tProductId, tEmail, tExpiry, tSig] = parts;
    if (tOrderId !== orderId || tProductId !== productId) return false;
    if (Number(tExpiry) < Date.now()) return false;

    const expectedPayload = `${tOrderId}:${tProductId}:${tEmail}:${tExpiry}`;
    const expectedSig = crypto.createHmac('sha256', config.jwtSecret).update(expectedPayload).digest('hex');
    return tSig === expectedSig ? { email: tEmail, expiry: Number(tExpiry) } : false;
  } catch (err) {
    return false;
  }
}

/**
 * 1. Admin: Upload software package, APK, EXE, or source ZIP for a product
 */
const uploadProductFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach an APK, EXE, ZIP or installer package.'
      });
    }

    const { productId, version, platform, changelog, isFree, isSourcePackage } = req.body;

    if (!productId) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Product ID is required for file association.'
      });
    }

    const product = await dbService.Product.findById(productId);
    if (!product) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: `Product ${productId} not found in catalog.`
      });
    }

    const fileSizeStr = formatFileSize(req.file.size);
    const safeVersion = version || product.version || 'v1.0.0';

    // Store file record
    const fileRecord = await dbService.ProductFile.create({
      productId: product.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: fileSizeStr,
      mimeType: req.file.mimetype,
      version: safeVersion,
      platform: platform || product.platform || 'Cross-Platform',
      changelog: changelog || 'Updated release package',
      isSourcePackage: isSourcePackage === 'true' || isSourcePackage === true,
      filePath: path.relative(path.join(__dirname, '../..'), req.file.path).replace(/\\/g, '/')
    });

    // Update product entity fileDetails automatically so frontend reflects new active file
    await dbService.Product.findByIdAndUpdate(product.id, {
      version: safeVersion,
      fileDetails: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: fileSizeStr,
        releaseDate: new Date().toISOString().split('T')[0],
        isFree: isFree === 'true' || isFree === true,
        hasDownload: true,
        hasSourceCode: isSourcePackage === 'true' || isSourcePackage === true || product.fileDetails?.hasSourceCode
      }
    });

    logger.success(`Admin uploaded software package: ${req.file.originalname} (${fileSizeStr}) for ${product.name}`);

    res.status(201).json({
      success: true,
      message: `Software package uploaded and linked to ${product.name} successfully.`,
      file: fileRecord
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. Generate secure temporary download token for an owned, PAID order
 */
const generateDownloadToken = async (req, res, next) => {
  try {
    const { orderId, productId } = req.params;
    const user = req.user;

    const order = await dbService.Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Verify ownership
    const isOwner = user && (order.userId === user._id || (order.clientEmail && order.clientEmail.toLowerCase() === user.email.toLowerCase()));
    const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

    if (!isOwner && !isAdmin && (!req.query.email || req.query.email.toLowerCase() !== order.clientEmail.toLowerCase())) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this order.' });
    }

    // Verify order is PAID
    if (order.status !== 'paid' && order.paymentStatus !== 'paid') {
      return res.status(402).json({
        success: false,
        message: 'Order is not yet paid. Please complete payment to unlock your download token.'
      });
    }

    const token = createDownloadToken(order.orderId, productId, order.clientEmail);
    const downloadUrl = `/api/downloads/${productId}?orderId=${order.orderId}&token=${encodeURIComponent(token)}`;

    res.status(200).json({
      success: true,
      token,
      orderId: order.orderId,
      productId,
      downloadUrl,
      expiresIn: '24 hours'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Secure Download Endpoint (Full Source Code & Binaries)
 */
const downloadProductFile = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await dbService.Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const isFree = Boolean(product.fileDetails && product.fileDetails.isFree === true);
    const user = req.user;
    const isAdmin = Boolean(user && (user.role === 'admin' || user.role === 'superadmin'));

    let hasAccess = isFree || isAdmin;
    let verifiedOrderId = null;
    let verifiedEmail = user ? user.email : 'Guest Visitor';

    // Check signed token
    if (!hasAccess && req.query.token && req.query.orderId) {
      const verifiedToken = verifyDownloadToken(req.query.token, req.query.orderId, product.id);
      if (verifiedToken) {
        const order = await dbService.Order.findOne({ orderId: req.query.orderId });
        if (order && (order.status === 'paid' || order.paymentStatus === 'paid')) {
          hasAccess = true;
          verifiedOrderId = order.orderId;
          verifiedEmail = verifiedToken.email;
        }
      }
    }

    // Check authenticated user's paid orders
    if (!hasAccess && user) {
      const paidOrders = await dbService.Order.find({
        status: 'paid'
      });

      const userPaidOrder = paidOrders.find(o => {
        const matchesUser = (o.userId && o.userId === user._id) || (o.clientEmail && o.clientEmail.toLowerCase() === user.email.toLowerCase());
        if (!matchesUser) return false;
        const matchesProduct = o.productId === product.id || 
                              (o.items && o.items.some(i => i.productId === product.id)) ||
                              (o.entitlements && o.entitlements.includes(product.id));
        return matchesProduct;
      });

      if (userPaidOrder) {
        hasAccess = true;
        verifiedOrderId = userPaidOrder.orderId;
        verifiedEmail = user.email;
      }
    }

    // Check guest order verification if orderId is provided
    if (!hasAccess && req.query.orderId) {
      const order = await dbService.Order.findOne({ orderId: req.query.orderId });
      if (order && (order.status === 'paid' || order.paymentStatus === 'paid')) {
        const matchesProduct = order.productId === product.id || 
                              (order.items && order.items.some(i => i.productId === product.id)) ||
                              (order.entitlements && order.entitlements.includes(product.id));
        if (matchesProduct) {
          // If customer provides matching email or accesses via verified paid orderId
          if (!req.query.email || req.query.email.toLowerCase() === (order.clientEmail || '').toLowerCase()) {
            hasAccess = true;
            verifiedOrderId = order.orderId;
            verifiedEmail = order.clientEmail || 'Verified Customer';
          }
        }
      }
    }

    // If still no access, strictly deny with 403 Forbidden
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Official full source code and package for "${product.name}" requires a verified PAID order. Please complete purchase and payment verification to access.`,
        requiresPayment: true,
        productId: product.id
      });
    }

    // Determine the exact file to serve
    // For Joya AI & Jarvis AI, prioritize serving the complete source code package!
    let resolvedFilePath = null;
    let downloadFilename = null;

    // Check if source package is requested or if product has source code
    const wantSource = req.query.type === 'source' || product.id === 'joya-ai' || product.id === 'jarvis-ai';

    if (wantSource) {
      const targetFilename = product.id === 'joya-ai' ? 'joya-ai-source-code-v2.4.0.zip' :
                             (product.id === 'jarvis-ai' ? 'jarvis-ai-source-code-v3.1.2.zip' : null);
      if (targetFilename && fs.existsSync(path.join(UPLOADS_DIR, targetFilename))) {
        resolvedFilePath = path.join(UPLOADS_DIR, targetFilename);
        downloadFilename = targetFilename;
      } else {
        const sourceFile = await dbService.ProductFile.findOne({ productId: product.id, isSourcePackage: true });
        if (sourceFile && sourceFile.filePath) {
          const cand = path.join(__dirname, '../../', sourceFile.filePath);
          if (fs.existsSync(cand)) {
            resolvedFilePath = cand;
            downloadFilename = sourceFile.originalName || sourceFile.filename;
          }
        }

        if (!resolvedFilePath) {
          // Look for source-code in uploads/products
          const candidates = fs.readdirSync(UPLOADS_DIR);
          const match = candidates.find(f => f.includes(product.id) && f.includes('source-code'));
          if (match) {
            resolvedFilePath = path.join(UPLOADS_DIR, match);
            downloadFilename = match;
          }
        }
      }
    }

    // If still not resolved, check standard product file records
    if (!resolvedFilePath) {
      const standardFile = await dbService.ProductFile.findOne({ productId: product.id });
      if (standardFile && standardFile.filePath) {
        const cand = path.join(__dirname, '../../', standardFile.filePath);
        if (fs.existsSync(cand)) {
          resolvedFilePath = cand;
          downloadFilename = standardFile.originalName || standardFile.filename;
        }
      }
    }

    // Default fallback in UPLOADS_DIR
    if (!resolvedFilePath) {
      const candidates = fs.readdirSync(UPLOADS_DIR);
      const match = candidates.find(f => f.toLowerCase().includes(product.id.toLowerCase()));
      if (match) {
        resolvedFilePath = path.join(UPLOADS_DIR, match);
        downloadFilename = match;
      }
    }

    if (!resolvedFilePath || !fs.existsSync(resolvedFilePath)) {
      return res.status(404).json({
        success: false,
        message: `Official source package for "${product.name}" is currently being prepared by the DevCraft engineering team.`
      });
    }

    // Record download audit telemetry
    const ip = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '127.0.0.1';
    await dbService.Download.create({
      productId: product.id,
      productName: product.name,
      userId: user ? user._id : null,
      orderId: verifiedOrderId,
      clientEmail: verifiedEmail,
      file: downloadFilename,
      ip: String(ip),
      timestamp: new Date().toISOString()
    });

    logger.info(`[Download Served] "${downloadFilename}" for product "${product.name}" to ${verifiedEmail} (Order: ${verifiedOrderId || 'FREE'})`);

    // Stream download safely with disposition attachment
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    const stream = fs.createReadStream(resolvedFilePath);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * 4. User / Admin: Get download audit history
 */
const getDownloadHistory = async (req, res, next) => {
  try {
    const user = req.user;
    let downloads = [];

    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      downloads = await dbService.Download.find({});
    } else if (user) {
      downloads = await dbService.Download.find({ userId: user._id });
      if (downloads.length === 0 && user.email) {
        downloads = await dbService.Download.find({ clientEmail: user.email });
      }
    }

    res.status(200).json({
      success: true,
      count: downloads.length,
      downloads
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  uploadProductFile,
  generateDownloadToken,
  downloadProductFile,
  getDownloadHistory
};
