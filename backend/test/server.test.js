const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');

process.env.NODE_ENV = 'test';
process.env.PORT = '5055';
const app = require('../src/server');

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

describe('BoardResultsBD & DU 7-College API Backend Test Suite', () => {

  test('1. Health check returns status OK', async () => {
    const res = await makeRequest('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'OK');
  });

  test('2. Missing roll or registration returns 400 error', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '' })
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  test('3. Invalid random roll/reg returns 404 Result Not Found', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '999999', registration: '0000000000' })
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Result Not Found');
  });

  test('4. Matching roll but wrong registration returns 404 Result Not Found', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '123456', registration: '1111111111' })
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Result Not Found');
  });

  test('5. Valid allowed roll and registration returns 200 and result data', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '123456', registration: '9876543210' })
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.result.name, 'MD. ARIFUL ISLAM');
    assert.strictEqual(res.body.result.roll, '123456');
    assert.ok(res.body.pdfUrl.startsWith('/api/result/pdf/'));

    // 6. Test PDF stream endpoint
    const pdfRes = await makeRequest(res.body.pdfUrl);
    assert.strictEqual(pdfRes.status, 200);
    assert.strictEqual(pdfRes.headers.get('content-type'), 'application/pdf');
    assert.ok(pdfRes.body.length > 1000);
    assert.strictEqual(pdfRes.body.subarray(0, 4).toString(), '%PDF');

    // 7. Test PDF download attachment disposition
    const downloadRes = await makeRequest(`${res.body.pdfUrl}?download=1`);
    assert.strictEqual(downloadRes.status, 200);
    assert.ok(downloadRes.headers.get('content-disposition').includes('attachment'));
  });

  test('8. Second allowed student (202401/1810987654) returns correct result', async () => {
    const res = await makeRequest('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '202401', registration: '1810987654' })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.result.name, 'NUSRAT JAHAN MIM');
    assert.strictEqual(res.body.result.college_name, 'Eden Mohila College, Dhaka');
  });

  test('9. Invalid/fake PDF token returns 404', async () => {
    const res = await makeRequest('/api/result/pdf/fake-token-123456');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  test('10. DU 7-College /api/web-select actions work properly', async () => {
    // get_pid2
    const pidRes = await makeRequest('/api/web-select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_pid2' })
    });
    assert.strictEqual(pidRes.status, 200);
    assert.ok(pidRes.body.options.length > 0);

    // get_result with allowed roll/reg
    const resultRes = await makeRequest('/api/web-select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_result', roll: '123456', reg: '9876543210' })
    });
    assert.strictEqual(resultRes.status, 200);
    assert.strictEqual(resultRes.body.result.name, 'MD. ARIFUL ISLAM');
    assert.ok(resultRes.body.courses.length > 0);

    // get_result with unlisted roll/reg
    const notFoundRes = await makeRequest('/api/web-select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_result', roll: '999999', reg: '8888888888' })
    });
    assert.strictEqual(notFoundRes.status, 404);
    assert.ok(notFoundRes.body.error.includes('Result Not Found'));
  });
});
