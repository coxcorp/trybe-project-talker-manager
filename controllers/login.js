const crypto = require('crypto');

const HTTP_OK_STATUS = 200;

async function login(req, res) {
  res.status(HTTP_OK_STATUS).json({ token: crypto.randomBytes(8).toString('hex') });
}

module.exports = login;
