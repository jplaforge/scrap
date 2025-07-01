const handler = require('./api/analyze');

const req = {
  method: 'POST',
  body: { url: 'https://example.com' }
};

const res = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(obj) {
    console.log('status', this.statusCode);
    console.log(obj);
  }
};

handler(req, res).catch(err => {
  console.error('Handler error', err);
});
