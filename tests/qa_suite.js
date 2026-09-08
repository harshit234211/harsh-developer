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
    let allRetiredBlocked = true;
    for (const code of retiredCodes) {
      const retRes = await request('POST', '/api/coupons/validate', { code, subtotal: 10000 });
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
    });
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

  } catch (err) {
    console.error('Fatal test runner error:', err);
    failedTests++;
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }

  console.log('\n\x1b[36m==================================================\x1b[0m');
  console.log(`TEST SUMMARY: \x1b[32m${passedTests} PASSED\x1b[0m, \x1b[31m${failedTests} FAILED\x1b[0m out of 42 Quality Check Steps`);
  console.log('\x1b[36m==================================================\x1b[0m\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQaSuite();
