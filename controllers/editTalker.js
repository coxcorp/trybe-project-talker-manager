const fs = require('fs').promises;

const HTTP_OK_STATUS = 200;
const FILENAME = 'talker.json';

async function editTalker(req, res) {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
  const editedTalker = { id: Number(id), name, age, talk };
  talkers[talkerIndex] = editedTalker;

  await fs.writeFile(FILENAME, JSON.stringify(talkers));
  return res.status(HTTP_OK_STATUS).json(editedTalker);
}

module.exports = editTalker;
