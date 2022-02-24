const fs = require('fs').promises;

const FILENAME = 'talker.json';

async function createTalker(req, res) {
  const { name, age, talk } = req.body;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const newTalker = { id: (talkers.length + 1), name, age, talk };

  talkers.push(newTalker);
  await fs.writeFile(FILENAME, JSON.stringify(talkers));
  return res.status(201).json({ id: (talkers.length + 1), ...newTalker });
}

module.exports = createTalker;
