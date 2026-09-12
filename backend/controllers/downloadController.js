const fs = require('fs');
const path = require('path');
const multer = require('multer');
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
 * Admin: Upload APK or Software installer for a product
 */
const uploadProductFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach an APK, EXE, ZIP or installer file.'
      });
    }

    const { productId, version, platform, changelog, isFree } = req.body;

    if (!productId) {
      // Remove uploaded file if no product id provided
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
      changelog: changelog || 'Initial release package',
      filePath: path.relative(path.join(__dirname, '../..'), req.file.path).replace(/\\/g, '/')
    });

    // Update product entity fileDetails
    await dbService.Product.findByIdAndUpdate(product.id, {
      version: safeVersion,
      fileDetails: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: fileSizeStr,
        releaseDate: new Date().toISOString().split('T')[0],
        isFree: isFree === 'true' || isFree === true,
        hasDownload: true
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
 * Public/Client: Download product software package (APK, EXE, ZIP)
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

    // Locate active file record or fallback starter file
    const fileRecord = await dbService.ProductFile.findOne({ productId: product.id });
    let resolvedFilePath = null;
    let downloadFilename = `${product.id}-release`;

    if (fileRecord && fileRecord.filePath) {
      const candidate = path.join(__dirname, '../../', fileRecord.filePath);
      if (fs.existsSync(candidate)) {
        resolvedFilePath = candidate;
        downloadFilename = fileRecord.originalName || fileRecord.filename;
      }
    }

    if (!resolvedFilePath) {
      // Check default distribution folder for matches
      const fallbackFiles = fs.readdirSync(UPLOADS_DIR);
      const match = fallbackFiles.find(f => f.toLowerCase().includes(product.id.toLowerCase()));
      if (match) {
        resolvedFilePath = path.join(UPLOADS_DIR, match);
        downloadFilename = match;
      }
    }

    if (!resolvedFilePath || !fs.existsSync(resolvedFilePath)) {
      return res.status(404).json({
        success: false,
        message: `Official downloadable build for "${product.name}" is currently being prepared by the engineering team. Check back shortly or contact support.`
      });
    }

    // Access authorization check
    const isFree = product.fileDetails && product.fileDetails.isFree === true;
    const user = req.user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

    let hasAccess = isFree || isAdmin;

    if (!hasAccess && user) {
      // Check if user has an active order for this product
      const userOrders = await dbService.Order.find({
        userId: user._id,
        productId: product.id
      });
      if (userOrders && userOrders.length > 0) {
        hasAccess = true;
      } else {
        // Also check by email
        const emailOrders = await dbService.Order.find({
          clientEmail: user.email,
          productId: product.id
        });
        if (emailOrders && emailOrders.length > 0) {
          hasAccess = true;
        }
      }
    }

    // Check optional orderId query parameter for guest checkout download
    if (!hasAccess && req.query.orderId) {
      const order = await dbService.Order.findOne({ orderId: req.query.orderId });
      if (order && (order.productId === product.id || (order.items && order.items.some(i => i.productId === product.id)))) {
        hasAccess = true;
      }
    }

    // For evaluation/demo purposes, Joya AI and Jarvis AI allow demo evaluation downloads
    if (!hasAccess && (product.id === 'joya-ai' || product.id === 'jarvis-ai' || req.query.demo === 'true')) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Official licensed build of "${product.name}" requires a confirmed order or active account entitlement.`,
        requiresOrder: true,
        productId: product.id
      });
    }

    // Record download telemetry
    const ip = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '127.0.0.1';
    await dbService.Download.create({
      productId: product.id,
      productName: product.name,
      userId: user ? user._id : null,
      clientEmail: user ? user.email : (req.query.email || 'Guest Visitor'),
      ip: String(ip),
      version: (fileRecord && fileRecord.version) || product.version || 'v1.0.0'
    });

    logger.info(`Download served: "${downloadFilename}" for product "${product.name}" to IP: ${ip}`);

    // Stream download
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    const fileStream = fs.createReadStream(resolvedFilePath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * User / Admin: Get download audit history
 */
const getDownloadHistory = async (req, res, next) => {
  try {
    const user = req.user;
    let downloads = [];

    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      downloads = await dbService.Download.find({});
    } else if (user) {
      downloads = await dbService.Download.find({ userId: user._id });
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
  downloadProductFile,
  getDownloadHistory
};
