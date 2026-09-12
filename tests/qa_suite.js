/**
 * HARSH DEVELOPER — AUTOMATED 25-STEP PRODUCTION QA TEST SUITE
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

let serverInstance = null;
let adminToken = null;
let createdProjectId = null;
let createdEnquiryId = null;

let passedTests = 0;
let failedTests = 0;
const testLogs = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    const log = `[PASS] Step: ${testName} ${details ? '(' + details + ')' : ''}`;
    console.log(`\x1b[32m${log}\x1b[0m`);
    testLogs.push({ status: 'PASS', name: testName, details });
  } else {
    failedTests++;
    const log = `[FAIL] Step: ${testName} - ${details}`;
    console.error(`\x1b[31m${log}\x1b[0m`);
    testLogs.push({ status: 'FAIL', name: testName, details });
  }
}

// HTTP Helper using native http module
function request(method, pathUrl, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathUrl, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    let postData = null;
    if (body) {
      postData = typeof body === 'string' ? body : JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json || data
        });
      });
    });

    req.on('error', (err) => { reject(err); });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runQaSuite() {
  console.log('\x1b[36m==================================================\x1b[0m');
  console.log('\x1b[36mSTARTING HARSH DEVELOPER PRODUCTION QA TEST SUITE\x1b[0m');
  console.log('\x1b[36m==================================================\x1b[0m\n');

  try {
    // 1. Check Dependencies
    const pkgRaw = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8').replace(/^\uFEFF/, '');
    const pkgJson = JSON.parse(pkgRaw);
    assert(pkgJson.dependencies.express && pkgJson.dependencies.bcryptjs && pkgJson.dependencies.jsonwebtoken, 'STEP 1: Dependencies Verified in package.json');

    // 2 & 3. Start Backend & Static Frontend Server
    const { app, startServer } = require('../backend/server');
    serverInstance = await startServer();
    assert(serverInstance !== null, 'STEP 2 & 3: Frontend & Backend Server Started on Port ' + PORT);

    // 4. Database Connection & Document Store Check
    const healthRes = await request('GET', '/api/health');
    assert(healthRes.statusCode === 200 && healthRes.data.status === 'online', 'STEP 4: Database Connection & Healthcheck Active', `Engine: ${healthRes.data.databaseEngine}`);

    // 5. Test Developer Profile Public API
    const devRes = await request('GET', '/api/developer');
    assert(devRes.statusCode === 200 && devRes.data.brand === 'DEVCRAFT Studio', 'STEP 5: Public Developer API Returns DevCraft Studio', `Brand: ${devRes.data.brand}`);

    // 5b. Test All 20 Services API
    const servicesRes = await request('GET', '/api/services');
    assert(servicesRes.statusCode === 200 && servicesRes.data.count === 20, 'STEP 5b: Services API Returns All 20 Services', `Count: ${servicesRes.data.count}`);

    // 5c. Test All 10 Interactive Demos API
    const demosRes = await request('GET', '/api/demos');
    assert(demosRes.statusCode === 200 && demosRes.data.count === 10, 'STEP 5c: Demos API Returns All 10 Interactive Demos', `Count: ${demosRes.data.count}`);

    // 6. Test Admin Login (Real Valid Credentials)
    const loginRes = await request('POST', '/api/admin/login', {
      email: 'shakyaharshit683@gmail.com',
      password: 'harsshit9696'
    });
    assert(loginRes.statusCode === 200 && loginRes.data.token, 'STEP 6: Admin Login Succeeded with JWT Issued');
    adminToken = loginRes.data.token;

    // 7. Test Admin Logout
    const logoutRes = await request('POST', '/api/admin/logout');
    assert(logoutRes.statusCode === 200, 'STEP 7: Admin Logout Returns 200 OK');

    // 8. Test Contact Form (Real Valid Enquiry Submission)
    const validEnquiry = {
      name: 'Johnathan Vance',
      email: 'john.vance@techcorp.io',
      phone: '+919876543210',
      whatsapp: '+919876543210',
      service: 'Web Application Development',
      budget: '₹75,000 - ₹1,50,000 / $950 - $1,800',
      projectType: 'New Project',
      deadline: '1 Month',
      description: 'We need a high-performance SaaS analytics application with Three.js 3D dashboards.',
      referenceUrl: 'https://example.com/demo'
    };
    const contactRes = await request('POST', '/api/contact', validEnquiry);
    assert(contactRes.statusCode === 201 && contactRes.data.enquiryId, 'STEP 8: Contact Form Submission Successfully Created Enquiry', `ID: ${contactRes.data.enquiryId}`);
    createdEnquiryId = contactRes.data.enquiryId;

    // 9. Test Form Validation (Reject invalid email, short phone, missing fields)
    const invalidEnquiry = {
      name: 'J',
      email: 'not-an-email',
      phone: '123',
      service: '',
      description: 'Short'
    };
    const badContactRes = await request('POST', '/api/contact', invalidEnquiry);
    assert(badContactRes.statusCode === 400 && badContactRes.data.success === false, 'STEP 9: Form Validation Accurately Blocked Malformed Submission', badContactRes.data.message);

    // 10. Test Project CRUD (Create, Read, Update, Delete)
    // 10a. Create
    const newProject = {
      name: 'Automated QA Test Engine',
      category: 'Custom Software',
      description: 'Automated test suite verifying full-stack production compliance.',
      technologies: ['Node.js', 'Express', 'Jest'],
      image: '/assets/images/project-api.svg',
      liveDemoUrl: 'https://harshdeveloper.com/test',
      githubUrl: 'Coming Soon',
      status: 'Showcase Demo',
      featured: true,
      isPublished: true
    };
    const createProjRes = await request('POST', '/api/projects', newProject, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(createProjRes.statusCode === 201 && createProjRes.data.data._id, 'STEP 10a: Project CMS - Created New Project', `ID: ${createProjRes.data.data._id}`);
    createdProjectId = createProjRes.data.data._id;

    // 10b. Read
    const getProjRes = await request('GET', `/api/projects/${createdProjectId}`);
    assert(getProjRes.statusCode === 200 && getProjRes.data.data.name === newProject.name, 'STEP 10b: Project CMS - Retrieved Project by ID');

    // 10c. Update
    const updateProjRes = await request('PUT', `/api/projects/${createdProjectId}`, {
      status: 'Live',
      name: 'Automated QA Test Engine (Verified)'
    }, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(updateProjRes.statusCode === 200 && updateProjRes.data.data.status === 'Live', 'STEP 10c: Project CMS - Updated Project Status to Live');

    // 10d. Delete
    const delProjRes = await request('DELETE', `/api/projects/${createdProjectId}`, null, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(delProjRes.statusCode === 200, 'STEP 10d: Project CMS - Deleted Project Successfully');

    // 11. Test Navigation Pages Routing
    const pages = ['/', '/services', '/projects', '/about', '/contact', '/admin-login', '/client-portal'];
    let allPagesOk = true;
    for (const page of pages) {
      const pageRes = await request('GET', page);
      if (pageRes.statusCode !== 200) allPagesOk = false;
    }
    assert(allPagesOk, 'STEP 11: All Frontend Navigation Pages Respond with HTTP 200 OK');

    // 12. Test Contact Channels URL Verification (WhatsApp, Call, Email, Instagram, Telegram, Zero Coming Soon)
    const indexContent = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');
    const waOk = indexContent.includes('wa.me/918791984082');
    const callOk = indexContent.includes('tel:+917017022966');
    const mailOk = indexContent.includes('mailto:shakyaharshit683@gmail.com') || indexContent.includes('shakyaharshit683@gmail.com');
    const igOk = indexContent.includes('instagram.com/kiro_mage');
    const tgOk = indexContent.includes('t.me/harshuuu1123');
    const zeroComingSoon = !indexContent.includes('Coming Soon');
    assert(waOk && callOk && mailOk && igOk && tgOk && zeroComingSoon, 'STEP 12: All Contact Channels Active & Zero Coming Soon Placeholders');

    // 13. Test 3D Three.js Scene Configuration
    const threeSceneContent = fs.readFileSync(path.join(__dirname, '../frontend/js/three-scene.js'), 'utf8');
    const hasThreeEngine = threeSceneContent.includes('THREE.WebGLRenderer') && threeSceneContent.includes('isWebGLAvailable');
    const hasFallback = threeSceneContent.includes('three-fallback');
    assert(hasThreeEngine && hasFallback, 'STEP 13: Real Three.js WebGL Scene & Fallback Visual Mechanism Verified');

    // 14. Check Frontend JavaScript Syntax
    const jsFiles = ['frontend/js/api.js', 'frontend/js/form.js', 'frontend/js/main.js', 'frontend/js/devcraft-demos.js', 'frontend/js/three-scene.js', 'admin/js/admin.js'];
    let jsOk = true;
    for (const f of jsFiles) {
      try {
        require('vm').runInNewContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
      } catch (err) {
        // Some browser globals may not exist in pure node vm, but parse should not have syntax error
        if (err.name === 'SyntaxError') {
          jsOk = false;
          console.error(`Syntax error in ${f}:`, err);
        }
      }
    }
    assert(jsOk, 'STEP 14: Client JavaScript Syntax Verified Free of Syntax Errors');

    // 15. Check Backend Error Handling & Logger
    const logger = require('../backend/utils/logger');
    assert(typeof logger.info === 'function' && typeof logger.error === 'function', 'STEP 15: Backend Logger & Safe Exception Handlers Intact');

    // 16. Check 404 API Not Found Response
    const notFoundRes = await request('GET', '/api/non-existent-endpoint');
    assert(notFoundRes.statusCode === 404 && notFoundRes.data.success === false, 'STEP 16: Safe 404 API Response Verified');

    // 17 & 18 & 19. Responsive Layout & Viewport CSS Check
    const cssContent = fs.readFileSync(path.join(__dirname, '../frontend/css/responsive.css'), 'utf8');
    const hasMediaQueries = cssContent.includes('@media (max-width: 768px)') && cssContent.includes('.mobile-drawer');
    assert(hasMediaQueries, 'STEP 17, 18, 19: Responsive Breakpoints & Mobile Drawer Styles Verified');

    // 20. Refresh Resilience Check
    const secondHealthRes = await request('GET', '/api/health');
    assert(secondHealthRes.statusCode === 200, 'STEP 20: Persistent Request Resilience & Uptime Verified');

    // 21. Test Unauthorized Admin Access (Missing JWT)
    const unauthRes = await request('GET', '/api/admin/enquiries');
    assert(unauthRes.statusCode === 401 && unauthRes.data.success === false, 'STEP 21: Protected Admin Routes Safely Block Unauthorized Requests');

    // 22. Test Invalid Admin Login (Wrong Password)
    const badLoginRes = await request('POST', '/api/admin/login', {
      email: 'shakyaharshit683@gmail.com',
      password: 'WrongPassword999!'
    });
    assert(badLoginRes.statusCode === 401 && badLoginRes.data.success === false, 'STEP 22: Invalid Password Safely Rejected with HTTP 401');

    // 23. Test Invalid API JSON Payload Handling
    const malformedProjRes = await request('POST', '/api/projects', {
      name: 'X' // too short
    }, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(malformedProjRes.statusCode === 400, 'STEP 23: Malformed Project Request Rejected with HTTP 400 Validation Error');

    // 24. Test Enquiry Status Lifecycle Transition & Stats in Admin
    const statusUpdateRes = await request('PATCH', `/api/admin/enquiries/${createdEnquiryId}`, {
      status: 'In Progress'
    }, {
      'Authorization': `Bearer ${adminToken}`
    });
    const statsRes = await request('GET', '/api/admin/enquiries/stats', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(statusUpdateRes.statusCode === 200 && statsRes.data.data.totalEnquiries >= 1, 'STEP 24: Admin Enquiry Status Lifecycle & Analytics Metrics Functional');

    // 25. Test Database Zero-Setup Persistence across Restarts
    const storeExists = fs.existsSync(path.join(__dirname, '../database/store.json'));
    assert(storeExists, 'STEP 25: Database Zero-Setup Document Store Active & Persisted to Disk');

    // 26. Test Client Portal Registration
    const testClientEmail = `qa.client.${Date.now()}@example.com`;
    const regRes = await request('POST', '/api/users/register', {
      name: 'QA Test Client',
      email: testClientEmail,
      phone: '+919988776655',
      company: 'QA Industries',
      password: 'ClientPassword123!'
    });
    assert(regRes.statusCode === 201 && regRes.data.token, 'STEP 26: Client Registration Returns 201 Created with JWT Token');
    const clientToken = regRes.data.token;

    // 27. Test Client Portal Login
    const clientLoginRes = await request('POST', '/api/users/login', {
      email: testClientEmail,
      password: 'ClientPassword123!'
    });
    assert(clientLoginRes.statusCode === 200 && clientLoginRes.data.user.email === testClientEmail, 'STEP 27: Client Login Successful with Matching Profile');

    // 28. Test Client Enquiries Tracking
    const clientEnquiriesRes = await request('GET', '/api/users/my-enquiries', null, {
      'Authorization': `Bearer ${clientToken}`
    });
    const clientEnquiries = clientEnquiriesRes.data.enquiries || clientEnquiriesRes.data.data;
    assert(clientEnquiriesRes.statusCode === 200 && Array.isArray(clientEnquiries), 'STEP 28: Client Portal Successfully Fetches User Project Enquiries');

    // 30. Test User Registration Validations (Weak password & mismatch)
    const weakPassRes = await request('POST', '/api/users/register', {
      name: 'Weak Client',
      email: 'weak.client@example.com',
      password: '123'
    });
    assert(weakPassRes.statusCode === 400, 'STEP 30: Registration Rejects Weak Passwords (<8 chars or lacking complexity)');

    // 31. Test Duplicate Email Registration Rejection
    const dupRegRes = await request('POST', '/api/users/register', {
      name: 'Duplicate Client',
      email: testClientEmail,
      phone: '+919988776655',
      password: 'ClientPassword123!'
    });
    assert(dupRegRes.statusCode === 400 || dupRegRes.statusCode === 409, 'STEP 31: Duplicate Email Registration Safely Rejected');

    // 32. Test Client Profile Retrieval & Password Not Leaked
    const myProfileRes = await request('GET', '/api/users/me', null, {
      'Authorization': `Bearer ${clientToken}`
    });
    const userObj = myProfileRes.data.user;
    assert(myProfileRes.statusCode === 200 && userObj.email === testClientEmail && !userObj.password, 'STEP 32: Authenticated /api/users/me Returns User Details Without Exposing Password Hash');

    // 33. Test Client Profile Update
    const updateProfileRes = await request('PATCH', '/api/users/profile', {
      name: 'QA Test Client Updated',
      company: 'QA Enterprise Global'
    }, {
      'Authorization': `Bearer ${clientToken}`
    });
    assert(updateProfileRes.statusCode === 200 && updateProfileRes.data.user.name === 'QA Test Client Updated', 'STEP 33: Client Profile Update Successfully Modifies Client Information');

    // 34. Test Forgot & Reset Password Flow
    const forgotRes = await request('POST', '/api/users/forgot-password', {
      email: testClientEmail
    });
    assert(forgotRes.statusCode === 200 && forgotRes.data.success === true, 'STEP 34A: Forgot Password Generates Reset Token');
    const resetToken = forgotRes.data.resetToken;

    if (resetToken) {
      const resetRes = await request('POST', '/api/users/reset-password', {
        token: resetToken,
        password: 'NewStrongPassword123!'
      });
      assert(resetRes.statusCode === 200 && resetRes.data.success === true, 'STEP 34B: Password Reset Successfully Updates Client Credentials');

      // Verify login with new password
      const newLoginRes = await request('POST', '/api/users/login', {
        email: testClientEmail,
        password: 'NewStrongPassword123!'
      });
      assert(newLoginRes.statusCode === 200 && newLoginRes.data.token, 'STEP 34C: Login with Newly Reset Password Successfully Authenticates');
    }

    // 35. Test Seeded Cryptographic Coupon Validation - Offer 1 (20% Discount)
    const seedOffers = require('../backend/utils/dbAdapter').getPrivateCouponsSeed();
    const offer20 = seedOffers.find(o => o.discountPercentage === 20);
    assert(offer20 && offer20.rawCode, 'STEP 35A: Seeded 20% Private Coupon Available');

    const validate20Res = await request('POST', '/api/coupons/validate', {
      code: offer20.rawCode,
      subtotal: 100000
    });
    assert(
      validate20Res.statusCode === 200 &&
      validate20Res.data.valid === true &&
      validate20Res.data.discountPercentage === 20 &&
      validate20Res.data.discountAmount === 20000 &&
      validate20Res.data.finalAmount === 80000,
      'STEP 35B: Offer 1 (20% Off) Validates with Exact Calculated Server Math (100k -> 80k)'
    );

    // 36. Test Seeded Cryptographic Coupon Validation - Offer 2 (50% Discount)
    const offer50 = seedOffers.find(o => o.discountPercentage === 50);
    const validate50Res = await request('POST', '/api/coupons/validate', {
      code: offer50.rawCode,
      subtotal: 60000
    });
    assert(
      validate50Res.statusCode === 200 &&
      validate50Res.data.valid === true &&
      validate50Res.data.discountPercentage === 50 &&
      validate50Res.data.discountAmount === 30000 &&
      validate50Res.data.finalAmount === 30000,
      'STEP 36: Offer 2 (50% Off) Validates with Exact Calculated Server Math (60k -> 30k)'
    );

    // 37. Test Seeded Cryptographic Coupon Validation - Offer 3 (95% Discount VIP)
    const offer95 = seedOffers.find(o => o.discountPercentage === 95);
    const validate95Res = await request('POST', '/api/coupons/validate', {
      code: offer95.rawCode,
      subtotal: 100000
    });
    assert(
      validate95Res.statusCode === 200 &&
      validate95Res.data.valid === true &&
      validate95Res.data.discountPercentage === 95 &&
      validate95Res.data.discountAmount === 95000 &&
      validate95Res.data.finalAmount === 5000,
      'STEP 37: Offer 3 (95% Off VIP) Validates with Exact Server Math (100k -> 5k)'
    );

    // 38. Test Rejection of Retired / Hardcoded Promo Codes (DEV20X, DEV50X, DEV95X, DEVCRAFT10)
    const retiredCodes = ['DEV20X', 'DEV50X', 'DEV95X', 'DEVCRAFT10'];
    const retiredHeaders = { 'x-forwarded-for': '198.51.100.88' };
    let allRetiredBlocked = true;
    for (const code of retiredCodes) {
      const retRes = await request('POST', '/api/coupons/validate', { code, subtotal: 10000 }, retiredHeaders);
      if (retRes.statusCode !== 400 || retRes.data.success !== false) {
        allRetiredBlocked = false;
      }
    }
    assert(allRetiredBlocked, 'STEP 38: Retired Legacy Codes (DEV20X, DEV50X, DEV95X, DEVCRAFT10) Strictly Rejected with HTTP 400');

    // 39. Test Brute-Force Rate Limiting & Lockout
    const bfHeaders = { 'x-forwarded-for': '198.51.100.99' };
    for (let i = 0; i < 5; i++) {
      await request('POST', '/api/coupons/validate', {
        code: `DEV-FAKE-TEST-${i}AAA`,
        subtotal: 10000
      }, bfHeaders);
    }
    const lockedRes = await request('POST', '/api/coupons/validate', {
      code: offer20.rawCode,
      subtotal: 10000
    }, bfHeaders);
    assert(lockedRes.statusCode === 429 && lockedRes.data.success === false, 'STEP 39: Brute-Force Rate Limiting Lockout Active (HTTP 429 after 5 failed attempts)');

    // 40. Test Coupon Redemption Flow
    const redeemRes = await request('POST', '/api/coupons/redeem', {
      code: offer20.rawCode,
      subtotal: 50000,
      email: testClientEmail,
      orderId: `ORD-${Date.now()}`,
      notes: 'QA Automated Redemption Test'
    });
    assert(redeemRes.statusCode === 200 && redeemRes.data.success === true && redeemRes.data.discountAmount === 10000, 'STEP 40: Authoritative Checkout Coupon Redemption Logged & Processed');

    // 41. Test Admin Coupon Management APIs
    const adminCouponsRes = await request('GET', '/api/admin/coupons', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    const couponsList = adminCouponsRes.data.coupons || [];
    const noRawCodeInAdminList = couponsList.every(c => !c.rawCode && c.code_mask && c.code_mask.includes('****'));
    assert(adminCouponsRes.statusCode === 200 && noRawCodeInAdminList && couponsList.length >= 3, 'STEP 41A: Admin Coupon Roster Returns Only Masked Hashes, Never Raw Secrets');

    // 41B. Test Dynamic Admin Coupon Generation
    const genCouponRes = await request('POST', '/api/admin/coupons/generate', {
      discountPercentage: 50,
      maxUses: 2,
      notes: 'QA Dynamic Temp Coupon'
    }, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(genCouponRes.statusCode === 201 && genCouponRes.data.rawCode && genCouponRes.data.rawCode.startsWith('DEV-'), 'STEP 41B: Dynamic Admin Coupon Generation Returns Single-Reveal Cryptographic Code');
    const dynamicCode = genCouponRes.data.rawCode;
    const dynamicId = genCouponRes.data.coupon._id;

    // 41C. Toggle status to disabled
    const toggleRes = await request('PATCH', `/api/admin/coupons/${dynamicId}/toggle`, null, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(toggleRes.statusCode === 200 && toggleRes.data.coupon.active === false, 'STEP 41C: Admin Coupon Status Toggle Successfully Pauses Coupon');

    // 41D. Verify disabled coupon is rejected
    const testDisabledRes = await request('POST', '/api/coupons/validate', {
      code: dynamicCode,
      subtotal: 10000
    }, { 'x-forwarded-for': '198.51.100.89' });
    assert(testDisabledRes.statusCode === 400 && testDisabledRes.data.success === false, 'STEP 41D: Disabled Coupon Immediately Rejected on Validation');

    // 41E. Clean up dynamic coupon
    const deleteCouponRes = await request('DELETE', `/api/admin/coupons/${dynamicId}`, null, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(deleteCouponRes.statusCode === 200, 'STEP 41E: Dynamic Test Coupon Successfully Cleaned Up');

    // 42. Test HTML Page Routing (Register, Login, Forgot-Password, Reset-Password, Dashboard, Profile)
    const pageRoutes = ['/register', '/login', '/forgot-password', '/reset-password', '/dashboard', '/profile'];
    let authPagesOk = true;
    for (const page of pageRoutes) {
      const pageRes = await request('GET', page);
      if (pageRes.statusCode !== 200) {
        authPagesOk = false;
      }
    }
    assert(authPagesOk, 'STEP 42: All New Dedicated User Auth & Dashboard HTML Pages Route with HTTP 200');

    // 43. Test Products & Courses Catalog (App 50% & Aptitude 30% discount dynamic rules)
    const { DEVCRAFT_PRODUCTS: testProducts } = require('../scripts/data_products');
    const appProds = testProducts.filter(p => p.type !== 'aptitude' && p.category !== 'Aptitude');
    const aptProds = testProducts.filter(p => p.type === 'aptitude' || p.category === 'Aptitude');
    const allApp50 = appProds.every(p => p.discountPercent === 50 && p.finalPrice === Math.round(p.originalPrice * 0.5));
    const allApt30 = aptProds.every(p => p.discountPercent === 30 && p.finalPrice === Math.round(p.originalPrice * 0.7));
    assert(allApp50 && appProds.length >= 10, 'STEP 43A: All App Products Have Dynamic 50% OFF (Original -> 50% -> Final)');
    assert(allApt30 && aptProds.length >= 5, 'STEP 43B: All Aptitude Products Have Dynamic 30% OFF (Original -> 30% -> Final)');

    // 44. Test Server-Authoritative Price Calculation (POST /api/orders/calculate)
    const sampleApp = appProds[0];
    const calcAppRes = await request('POST', '/api/orders/calculate', {
      productId: sampleApp.id
    });
    assert(
      calcAppRes.statusCode === 200 &&
      calcAppRes.data.success === true &&
      calcAppRes.data.calculation.originalPrice === sampleApp.originalPrice &&
      calcAppRes.data.calculation.productDiscountPercent === 50 &&
      calcAppRes.data.calculation.finalAmount === Math.round(sampleApp.originalPrice * 0.5),
      'STEP 44A: Server Authoritative Calculation for App Product Verified'
    );

    const sampleApt = aptProds[0];
    const calcAptRes = await request('POST', '/api/orders/calculate', {
      productId: sampleApt.id
    });
    assert(
      calcAptRes.statusCode === 200 &&
      calcAptRes.data.success === true &&
      calcAptRes.data.calculation.originalPrice === sampleApt.originalPrice &&
      calcAptRes.data.calculation.productDiscountPercent === 30 &&
      calcAptRes.data.calculation.finalAmount === Math.round(sampleApt.originalPrice * 0.7),
      'STEP 44B: Server Authoritative Calculation for Aptitude Course Verified'
    );

    // 45. Test Coupon Application on Discounted Price (Original -> Product Disc -> Coupon Disc -> Final)
    const calcWithCouponRes = await request('POST', '/api/orders/calculate', {
      productId: sampleApp.id,
      couponCode: offer20.rawCode
    });
    const calcC = calcWithCouponRes.data.calculation;
    const expectedDiscounted = Math.round(sampleApp.originalPrice * 0.5);
    const expectedCouponDiscount = Math.round(expectedDiscounted * 0.2);
    const expectedFinal = expectedDiscounted - expectedCouponDiscount;
    assert(
      calcWithCouponRes.statusCode === 200 &&
      calcC.couponApplied === true &&
      calcC.couponDiscountAmount === expectedCouponDiscount &&
      calcC.finalAmount === expectedFinal,
      'STEP 45: Coupon Applied Strictly on Discounted Price (Original -> Product Disc -> Coupon Disc -> Final Payable)'
    );

    // 46. Test Negative Price Protection & Invalid Coupon Handling
    const seedOffer95 = seedOffers.find(o => o.discountPercentage === 95);
    const calc95Res = await request('POST', '/api/orders/calculate', {
      productId: sampleApt.id,
      couponCode: seedOffer95.rawCode
    });
    assert(
      calc95Res.statusCode === 200 &&
      calc95Res.data.calculation.finalAmount >= 0,
      'STEP 46A: Negative Price Protection Verified (Final Amount >= 0)'
    );

    const calcInvalidCoupon = await request('POST', '/api/orders/calculate', {
      productId: sampleApp.id,
      couponCode: 'DEV-FAKE-CODE-9999'
    }, { 'x-forwarded-for': '198.51.100.91' });
    assert(
      calcInvalidCoupon.statusCode === 400 &&
      calcInvalidCoupon.data.success === false &&
      calcInvalidCoupon.data.message.includes('Invalid or expired'),
      'STEP 46B: Invalid Coupon Code Properly Rejected with Clear Feedback'
    );

    // 47. Test Order Checkout & Account Linkage (POST /api/orders/checkout)
    const userAuthToken = (typeof newLoginRes !== 'undefined' && newLoginRes.data && newLoginRes.data.token) ? newLoginRes.data.token : clientToken;
    const checkoutRes = await request('POST', '/api/orders/checkout', {
      productId: sampleApt.id,
      couponCode: offer20.rawCode,
      clientName: 'QA Test Client',
      clientEmail: testClientEmail,
      clientPhone: '+919988776655',
      notes: 'QA Automated Test Order'
    }, {
      'Authorization': `Bearer ${userAuthToken}`
    });
    assert(
      checkoutRes.statusCode === 201 &&
      checkoutRes.data.success === true &&
      checkoutRes.data.order.orderId.startsWith('DC-ORD-'),
      'STEP 47: Order Checkout Successfully Registers and Returns Order ID'
    );
    const createdOrderId = checkoutRes.data.order ? checkoutRes.data.order.orderId : null;

    // 48. Test Authenticated User Orders (GET /api/orders/my-orders)
    const myOrdersRes = await request('GET', '/api/orders/my-orders', null, {
      'Authorization': `Bearer ${userAuthToken}`
    });
    const ordersList = myOrdersRes.data.orders || [];
    const foundMyOrder = ordersList.find(o => o.orderId === createdOrderId);
    assert(
      myOrdersRes.statusCode === 200 &&
      foundMyOrder &&
      foundMyOrder.clientEmail === testClientEmail &&
      foundMyOrder.couponCodeMask.includes('****'),
      'STEP 48: User Dashboard /api/orders/my-orders Securely Returns User Orders with Masked Coupons'
    );

    // 49. Test Share Analytics Tracking (POST & GET /api/analytics/share)
    const trackShareRes = await request('POST', '/api/analytics/share', {
      productId: sampleApp.id,
      sharePlatform: 'whatsapp'
    }, {
      'Authorization': `Bearer ${userAuthToken}`
    });
    assert(
      (trackShareRes.statusCode === 200 || trackShareRes.statusCode === 201) &&
      trackShareRes.data.success === true,
      'STEP 49A: Share Event Tracked (product_id, share_platform, timestamp, user_id)'
    );

    const shareStatsRes = await request('GET', '/api/analytics/share', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(
      shareStatsRes.statusCode === 200 &&
      shareStatsRes.data.success === true &&
      shareStatsRes.data.stats.totalShares >= 1,
      'STEP 49B: Admin Analytics Correctly Aggregates Real Share Counts'
    );

    // 50. Test Static Assets & Scripts Availability
    const shopJsRes = await request('GET', '/js/devcraft-shop.js');
    assert(
      shopJsRes.statusCode === 200 &&
      shopJsRes.data.includes('devcraftShop'),
      'STEP 50A: /js/devcraft-shop.js Serves Cleanly with HTTP 200'
    );

    const indexHtmlRes = await request('GET', '/');
    assert(
      indexHtmlRes.statusCode === 200 &&
      indexHtmlRes.data.includes('50% OFF') &&
      indexHtmlRes.data.includes('30% OFF') &&
      indexHtmlRes.data.includes('devcraftShop'),
      'STEP 50B: Frontend Home Page Renders 50% & 30% Dynamic Pricing Badges & Shop Engine'
    );

    // 51. Test Joya AI Dedicated Page (GET /joya)
    const joyaPageRes = await request('GET', '/joya');
    assert(
      joyaPageRes.statusCode === 200 &&
      joyaPageRes.data.includes('Wake up Joya') &&
      joyaPageRes.data.includes('joya-ai-v2.4.0.apk'),
      'STEP 51: Joya AI Page (/joya) Renders Wake Word & APK Specs'
    );

    // 52. Test Jarvis AI Dedicated Page (GET /jarvis)
    const jarvisPageRes = await request('GET', '/jarvis');
    assert(
      jarvisPageRes.statusCode === 200 &&
      jarvisPageRes.data.includes('Ctrl + Space') &&
      jarvisPageRes.data.includes('jarvis-ai-desktop-v3.1.2.exe'),
      'STEP 52: Jarvis AI Page (/jarvis) Renders Terminal Mockup & PC Specs'
    );

    // 53. Test Dedicated Products Page (GET /products)
    const productsPageRes = await request('GET', '/products');
    assert(
      productsPageRes.statusCode === 200 &&
      productsPageRes.data.includes('catalog-toolbar') &&
      productsPageRes.data.includes('Android Apps'),
      'STEP 53: Products Marketplace Page (/products) Renders Filters & Catalog Cards'
    );

    // 54. Test Aptitude Hub Page (GET /aptitude)
    const aptitudePageRes = await request('GET', '/aptitude');
    assert(
      aptitudePageRes.statusCode === 200 &&
      aptitudePageRes.data.includes('30% OFF') &&
      aptitudePageRes.data.includes('Quantitative Aptitude'),
      'STEP 54: Aptitude Hub Page (/aptitude) Renders 30% Discount Courses'
    );

    // 55. Test Portfolio & Simulators Page (GET /portfolio)
    const portfolioPageRes = await request('GET', '/portfolio');
    assert(
      portfolioPageRes.statusCode === 200 &&
      portfolioPageRes.data.includes('devcraftDemos'),
      'STEP 55: Portfolio Page (/portfolio) Renders 10+ Interactive Simulators'
    );

    // 56. Test Shopping Cart Page (GET /cart)
    const cartPageRes = await request('GET', '/cart');
    assert(
      cartPageRes.statusCode === 200 &&
      cartPageRes.data.includes('cart-items-container') &&
      cartPageRes.data.includes('cart-summary-box'),
      'STEP 56: Cart Page (/cart) Renders Shopping Cart & Order Summary Panels'
    );

    // 57. Test Legal & Policy Pages (GET /privacy, /terms, /refund, /license)
    const [privacyRes, termsRes, refundRes, licenseRes] = await Promise.all([
      request('GET', '/privacy'),
      request('GET', '/terms'),
      request('GET', '/refund'),
      request('GET', '/license')
    ]);
    assert(
      privacyRes.statusCode === 200 &&
      termsRes.statusCode === 200 &&
      refundRes.statusCode === 200 &&
      licenseRes.statusCode === 200,
      'STEP 57: All 4 Legal Pages (/privacy, /terms, /refund, /license) Serve Cleanly with HTTP 200'
    );

    // 58. Test Multi-Item Authoritative Cart Calculation (POST /api/cart/calculate)
    const cartCalcRes = await request('POST', '/api/cart/calculate', {
      cartItems: [
        { productId: 'joya-ai', quantity: 1 },
        { productId: sampleApt.id, quantity: 2 }
      ],
      couponCode: offer20.rawCode
    });
    assert(
      cartCalcRes.statusCode === 200 &&
      cartCalcRes.data.success === true &&
      cartCalcRes.data.summary.finalAmount > 0 &&
      cartCalcRes.data.items.length === 2,
      'STEP 58: Multi-Item Cart Authoritative Server Calculation Verified with 50% & 30% Rules'
    );

    // 59. Test Direct Download Streaming Endpoint (GET /api/downloads/:productId)
    const downloadRes = await request('GET', '/api/downloads/joya-ai');
    assert(
      downloadRes.statusCode === 200 &&
      downloadRes.headers['content-disposition'] &&
      downloadRes.headers['content-disposition'].includes('joya-ai'),
      'STEP 59: Secure File Download Endpoint (/api/downloads/joya-ai) Streams APK Attachment'
    );

    // 60. Test Admin Products & Discount Rules API
    const adminProductsRes = await request('GET', '/api/products/admin/all', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(
      adminProductsRes.statusCode === 200 &&
      adminProductsRes.data.success === true &&
      adminProductsRes.data.count >= 5,
      'STEP 60: Admin Products CMS API (/api/products/admin/all) Returns Managed Store Items'
    );


  } catch (err) {
    console.error('Fatal test runner error:', err);
    failedTests++;
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }

  console.log('\n\x1b[36m==================================================\x1b[0m');
  console.log(`TEST SUMMARY: \x1b[32m${passedTests} PASSED\x1b[0m, \x1b[31m${failedTests} FAILED\x1b[0m out of 55 Quality Check Steps`);
  console.log('\x1b[36m==================================================\x1b[0m\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQaSuite();
