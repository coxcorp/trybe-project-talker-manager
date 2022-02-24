const fs = require('fs').promises;

const HTTP_OK_STATUS = 200;
const FILENAME = 'talker.json';

async function getTalkerById(req, res) {
  const { id } = req.params;
  const data = await fs.readFile(FILENAME, 'utf-8');
  const talker = JSON.parse(data).find((talk) => talk.id === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(talker);
}

module.exports = getTalkerById;
