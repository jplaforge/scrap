const assert = require('assert');
const handler = require('./api/analyze');

async function runTests() {
  const res = {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; }
  };

  // Non-POST method
  await handler({ method: 'GET' }, res);
  assert.strictEqual(res.statusCode, 405);
  assert.deepStrictEqual(res.body, { error: 'Only POST supported' });

  // Missing URL
  await handler({ method: 'POST', body: {} }, res);
  assert.strictEqual(res.statusCode, 400);
  assert.deepStrictEqual(res.body, { error: 'Missing url' });

  console.log('Tests passed');
}

runTests().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
