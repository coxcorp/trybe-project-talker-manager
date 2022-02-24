const fs = require('fs').promises;

const FILENAME = 'talker.json';

async function deleteTalker(req, res) {
  const { id } = req.params;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const undeletedTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await fs.writeFile(FILENAME, JSON.stringify(undeletedTalkers));
  return res.status(204).end();
}

module.exports = deleteTalker;
