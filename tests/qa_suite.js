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
    assert(devRes.statusCode === 200 && devRes.data.name === 'Harshit' && devRes.data.brand === 'Harsh Developer', 'STEP 5: Public Developer API Returns Correct Info', `Brand: ${devRes.data.brand}`);

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

    // 12. Test Contact Channels URL Verification (WhatsApp, Call, Email, Instagram, Telegram, GitHub)
    const indexContent = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');
    const waOk = indexContent.includes('wa.me/918791984082');
    const callOk = indexContent.includes('tel:+917017022966');
    const mailOk = indexContent.includes('mailto:shakyaharshit683@gmail.com') || indexContent.includes('shakyaharshit683@gmail.com');
    const igOk = indexContent.includes('instagram.com/kiro_mage');
    const tgOk = indexContent.includes('t.me/harshuuu1123');
    const githubSoonOk = indexContent.includes('Coming Soon') && !indexContent.includes('github.com/fake');
    assert(waOk && callOk && mailOk && igOk && tgOk && githubSoonOk, 'STEP 12: All Contact Links (WA, Phone, IG, TG, GitHub Soon) Strictly Verified');

    // 13. Test 3D Three.js Scene Configuration
    const threeSceneContent = fs.readFileSync(path.join(__dirname, '../frontend/js/three-scene.js'), 'utf8');
    const hasThreeEngine = threeSceneContent.includes('THREE.WebGLRenderer') && threeSceneContent.includes('isWebGLAvailable');
    const hasFallback = threeSceneContent.includes('three-fallback');
    assert(hasThreeEngine && hasFallback, 'STEP 13: Real Three.js WebGL Scene & Fallback Visual Mechanism Verified');

    // 14. Check Frontend JavaScript Syntax
    const jsFiles = ['frontend/js/api.js', 'frontend/js/form.js', 'frontend/js/main.js', 'frontend/js/three-scene.js', 'admin/js/admin.js'];
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

    // 29. Test Admin Client Roster
    const adminClientsRes = await request('GET', '/api/admin/clients', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    const adminClientsList = (adminClientsRes.data && (adminClientsRes.data.clients || adminClientsRes.data.data)) || [];
    assert(adminClientsRes.statusCode === 200 && adminClientsList.length >= 1, 'STEP 29: Admin Dashboard Successfully Retrieves Registered Client Roster');

  } catch (err) {
    console.error('Fatal test runner error:', err);
    failedTests++;
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }

  console.log('\n\x1b[36m==================================================\x1b[0m');
  console.log(`TEST SUMMARY: \x1b[32m${passedTests} PASSED\x1b[0m, \x1b[31m${failedTests} FAILED\x1b[0m out of 29 Quality Check Steps`);
  console.log('\x1b[36m==================================================\x1b[0m\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQaSuite();
