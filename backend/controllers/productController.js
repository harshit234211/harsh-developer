const dbService = require('../utils/dbAdapter');
const { calculateAuthoritativePrice, DEVCRAFT_PRODUCTS } = require('../utils/pricingEngine');
const logger = require('../utils/logger');

/**
 * Public: Get all active products with dynamic pricing & category filters
 */
const getPublicProducts = async (req, res, next) => {
  try {
    const { category, type, search } = req.query;
    let products = await dbService.Product.find({ active: true });

    if (type) {
      products = products.filter(p => p.type && p.type.toLowerCase() === type.toLowerCase());
    }

    if (category && category !== 'All') {
      products = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q)) ||
        (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Attach latest file upload metadata if available
    const files = await dbService.ProductFile.find({});
    const productsWithFiles = products.map(p => {
      const fileRecord = files.find(f => f.productId === p.id);
      return {
        ...p,
        downloadAvailable: !!(p.fileDetails && p.fileDetails.hasDownload) || !!fileRecord,
        activeFile: fileRecord || null
      };
    });

    res.status(200).json({
      success: true,
      count: productsWithFiles.length,
      products: productsWithFiles
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Public: Get single product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await dbService.Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const fileRecord = await dbService.ProductFile.findOne({ productId: product.id });

    res.status(200).json({
      success: true,
      product: {
        ...product,
        downloadAvailable: !!(product.fileDetails && product.fileDetails.hasDownload) || !!fileRecord,
        activeFile: fileRecord || null
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Get all products (including draft/inactive)
 */
const getAdminProducts = async (req, res, next) => {
  try {
    const products = await dbService.Product.find({});
    const files = await dbService.ProductFile.find({});

    const productsWithFiles = products.map(p => {
      const fileRecord = files.find(f => f.productId === p.id);
      return {
        ...p,
        activeFile: fileRecord || null
      };
    });

    res.status(200).json({
      success: true,
      count: productsWithFiles.length,
      products: productsWithFiles
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Create new product
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, category, platform, originalPrice, discountPercent, shortDesc, detailedDesc, features, technologies, version } = req.body;

    if (!name || !category || !originalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and original price are required.'
      });
    }

    const newProduct = await dbService.Product.create(req.body);
    logger.success(`Admin created product: ${newProduct.name} (${newProduct.id})`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Update product details, pricing, discount, or status
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await dbService.Product.findByIdAndUpdate(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    logger.info(`Admin updated product: ${updated.name} (${updated.id})`);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Delete product
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dbService.Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    logger.info(`Admin deleted product: ${deleted.name} (${deleted.id})`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Get configurable global discount rules
 */
const getDiscountRules = async (req, res, next) => {
  try {
    const rules = dbService.getDiscountRules();
    res.status(200).json({
      success: true,
      rules
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Update configurable global discount rules
 */
const updateDiscountRules = async (req, res, next) => {
  try {
    const { appDefaultDiscount, aptitudeDefaultDiscount } = req.body;
    const appDiscount = Number(appDefaultDiscount);
    const aptDiscount = Number(aptitudeDefaultDiscount);

    if (isNaN(appDiscount) || appDiscount < 0 || appDiscount > 99) {
      return res.status(400).json({
        success: false,
        message: 'App discount must be a valid percentage between 0 and 99.'
      });
    }

    if (isNaN(aptDiscount) || aptDiscount < 0 || aptDiscount > 99) {
      return res.status(400).json({
        success: false,
        message: 'Aptitude discount must be a valid percentage between 0 and 99.'
      });
    }

    const updated = dbService.updateDiscountRules({
      appDefaultDiscount: appDiscount,
      aptitudeDefaultDiscount: aptDiscount
    });

    logger.success(`Admin updated discount rules: Apps ${appDiscount}% OFF, Aptitude ${aptDiscount}% OFF`);

    res.status(200).json({
      success: true,
      message: 'Discount rules updated successfully.',
      rules: updated
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getDiscountRules,
  updateDiscountRules
};
