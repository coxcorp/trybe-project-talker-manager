const fs = require('fs').promises;

const HTTP_OK_STATUS = 200;
const FILENAME = 'talker.json';

async function searchTalker(req, res) {
  const { q } = req.query;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const findTalkers = talkers.filter((talker) => talker.name.includes(q));
  return res.status(HTTP_OK_STATUS).json(findTalkers);
}

module.exports = searchTalker;
