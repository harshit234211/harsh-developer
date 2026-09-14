const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

/**
 * 1. Track client-side analytics event
 * POST /api/analytics/track
 */
const trackEvent = async (req, res, next) => {
  try {
    const { event, data, path, referrer } = req.body;

    if (!event || typeof event !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid event name is required.'
      });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const payload = {
      event: event.trim(),
      data: data && typeof data === 'object' ? data : {},
      path: (path && typeof path === 'string') ? path.trim() : '/',
      referrer: (referrer && typeof referrer === 'string') ? referrer.trim() : '',
      userAgent,
      ip: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : '',
      userId: req.user ? (req.user._id || req.user.id) : null,
      userEmail: req.user ? req.user.email : ''
    };

    const saved = await dbService.AnalyticsEvent.create(payload);

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully.',
      id: saved._id || saved.id
    });
  } catch (err) {
    logger.error('Failed to track analytics event: ' + err.message);
    next(err);
  }
};

/**
 * 2. Get customer insights for Admin Dashboard
 * GET /api/admin/insights
 */
const getAdminInsights = async (req, res, next) => {
  try {
    const events = await dbService.AnalyticsEvent.find({});
    const orders = await dbService.Order.find({});
    const products = await dbService.Product.find({});
    const users = await dbService.User.find({});

    // 1. Search Queries
    const searchQueries = {};
    // 2. Viewed Products
    const productViews = {};
    // 3. CTA / Service clicks
    const ctaClicks = {};

    let totalPageViews = 0;
    let checkoutStarts = 0;

    events.forEach(evt => {
      const name = evt.event;
      const data = evt.data || {};

      if (name === 'page_view') {
        totalPageViews++;
      } else if (name === 'search' && data.query) {
        const q = String(data.query).toLowerCase().trim();
        if (q) searchQueries[q] = (searchQueries[q] || 0) + 1;
      } else if (name === 'product_view' || name === 'view_product') {
        const pid = data.productId || data.title || 'Unknown Product';
        productViews[pid] = (productViews[pid] || 0) + 1;
      } else if (name === 'checkout_start') {
        checkoutStarts++;
      } else if (name === 'cta_click' || name === 'service_click') {
        const label = data.label || data.service || 'General CTA';
        ctaClicks[label] = (ctaClicks[label] || 0) + 1;
      }
    });

    const topSearches = Object.entries(searchQueries)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topProducts = Object.entries(productViews)
      .map(([product, views]) => ({ product, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const topCtas = Object.entries(ctaClicks)
      .map(([target, clicks]) => ({ target, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID' || o.paymentStatus === 'completed');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.authoritativeAmount || o.amount || 0), 0);
    const conversionRate = totalPageViews > 0 
      ? Number(((paidOrders.length / totalPageViews) * 100).toFixed(2)) 
      : 0;

    res.status(200).json({
      success: true,
      insights: {
        totalEvents: events.length,
        totalPageViews,
        checkoutStarts,
        paidOrdersCount: paidOrders.length,
        totalRevenue,
        conversionRate,
        registeredUsersCount: users.length,
        topSearches,
        topProducts,
        topCtas,
        recentEvents: events.slice(-25).reverse()
      }
    });
  } catch (err) {
    logger.error('Failed to get admin insights: ' + err.message);
    next(err);
  }
};

module.exports = {
  trackEvent,
  getAdminInsights
};
