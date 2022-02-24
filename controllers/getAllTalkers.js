const fs = require('fs').promises;

const HTTP_OK_STATUS = 200;
const FILENAME = 'talker.json';

async function getAllTalkers(req, res) {
  const data = await fs.readFile(FILENAME, 'utf-8');
  return res.status(HTTP_OK_STATUS).json(JSON.parse(data));
}

module.exports = getAllTalkers;
