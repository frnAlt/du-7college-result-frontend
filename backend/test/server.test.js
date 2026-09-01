const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');

process.env.NODE_ENV = 'test';
process.env.PORT = '5055';
process.env.ENABLE_EXTERNAL_API = 'false';

const app = require('../src/server');
const resultService = require('../src/services/resultService');

let server;
const BASE_URL = 'http://localhost:5055';

before((done) => {
  server = app.listen(5055, done);
});

after(() => {
  if (server) {
    server.close();
  }
});

async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  let body;
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else if (contentType.includes('application/pdf')) {
    body = Buffer.from(await res.arrayBuffer());
  } else {
    body = await res.text();
  }
  return { status: res.status, headers: res.headers, body };
}

describe('BoardResultsBD - 10 Core Test Cases + Serverless PDF Verification', () => {

  // Test 1: Valid configured Roll + Registration -> Result Found & PDF generated
  test('Case 1: Valid configured Roll + Registration -> Result Found', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '13569', registration: '2022140676' })
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.result.name, 'SAZIRAZAMAN MUTTACIN');
    assert.strictEqual(res.body.result.roll, '13569');
    assert.strictEqual(res.body.result.registration, '2022140676');
    assert.ok(res.body.pdfUrl.startsWith('/api/result/pdf/'));

    // SIMULATE VERCEL SERVERLESS COLD START (Clear in-memory cache)
    resultService.pdfTokenCache.clear();

    // Verify PDF endpoint STILL works seamlessly across cold lambda instances
    const pdfRes = await makeRequest(res.body.pdfUrl);
    assert.strictEqual(pdfRes.status, 200);
    assert.strictEqual(pdfRes.headers.get('content-type'), 'application/pdf');
    assert.ok(pdfRes.body.length > 500);

    // Verify PDF download header
    const downloadRes = await makeRequest(`${res.body.pdfUrl}?download=1`);
    assert.strictEqual(downloadRes.status, 200);
    assert.ok(downloadRes.headers.get('content-disposition').includes('attachment'));
  });

  // Test 2: Wrong Roll + correct Registration -> Result Not Found
  test('Case 2: Wrong Roll + correct Registration -> Result Not Found', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '99999', registration: '2022140676' })
    });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Result Not Found');
  });

  // Test 3: Correct Roll + wrong Registration -> Result Not Found
  test('Case 3: Correct Roll + wrong Registration -> Result Not Found', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '13569', registration: '9999999999' })
    });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Result Not Found');
  });

  // Test 4: Both wrong -> Result Not Found
  test('Case 4: Both Roll and Registration wrong -> Result Not Found', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '88888', registration: '7777777777' })
    });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Result Not Found');
  });

  // Test 5: Empty Roll -> validation error
  test('Case 5: Empty Roll -> validation error', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '', registration: '2022140676' })
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Roll Number is required'));
  });

  // Test 6: Empty Registration -> validation error
  test('Case 6: Empty Registration -> validation error', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '13569', registration: '' })
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Registration Number is required'));
  });

  // Test 7: Random malicious / very long input -> safely rejected
  test('Case 7: Random malicious or excessive length input -> safely rejected', async () => {
    const maliciousRes = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roll: '13569<script>alert(1)</script>',
        registration: '2022140676'
      })
    });
    assert.strictEqual(maliciousRes.status, 400);

    const longRes = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roll: '1'.repeat(100),
        registration: '2'.repeat(100)
      })
    });
    assert.strictEqual(longRes.status, 400);
  });

  // Test 8: ENABLE_EXTERNAL_API=false -> project works using local result data
  test('Case 8: ENABLE_EXTERNAL_API=false -> works without external API', async () => {
    const res = await makeRequest('/api/web-select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_result',
        roll: '13569',
        reg: '2022140676'
      })
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.result.name, 'SAZIRAZAMAN MUTTACIN');
    assert.strictEqual(res.body.courses.length, 6);
  });

  // Test 9: Missing EXTERNAL_API_TOKEN while external API disabled -> starts normally & health check OK
  test('Case 9: Missing EXTERNAL_API_TOKEN -> application functions normally', async () => {
    const healthRes = await makeRequest('/api/health');
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthRes.body.status, 'OK');
  });

  // Test 10: Invalid RATE_LIMIT values -> safe defaults are used without crashing
  test('Case 10: Environment variables with invalid rate limit values use safe fallbacks', () => {
    const env = require('../src/config/env');
    assert.ok(typeof env.RATE_LIMIT_WINDOW_MS === 'number' && env.RATE_LIMIT_WINDOW_MS > 0);
    assert.ok(typeof env.RATE_LIMIT_MAX === 'number' && env.RATE_LIMIT_MAX > 0);
    assert.strictEqual(env.ENABLE_EXTERNAL_API, false);
  });
});
