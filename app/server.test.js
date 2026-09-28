const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('./server.js');

function request(path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.get({ host: '127.0.0.1', port, path }, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          server.close();
          resolve({ statusCode: res.statusCode, body });
        });
      });

      req.on('error', (error) => {
        server.close();
        reject(error);
      });
    });
  });
}

test('GET / returns the welcome message', async () => {
  const response = await request('/');
  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Welcome to the Release Readiness Lab API/);
});

test('GET /health returns ok status payload', async () => {
  const response = await request('/health');
  assert.equal(response.statusCode, 200);
  const parsed = JSON.parse(response.body);
  assert.equal(parsed.status, 'ok');
  assert.equal(parsed.version, '1.0.0');
});
