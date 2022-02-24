const express = require('express');
const crypto = require('crypto');
const fs = require('fs').promises;
const authValidation = require('./middlewares/auth');
const nameValidation = require('./middlewares/nameValidation');
const ageValidation = require('./middlewares/ageValidation');
const talkKeyValidation = require('./middlewares/talkKeyValidation');
const rateValidation = require('./middlewares/rateValidation');
const dateValidation = require('./middlewares/dateValidation');
const emailValidation = require('./middlewares/emailValidation');
const passwordValidation = require('./middlewares/passwordValidation');
const getAllTalkers = require('./controllers/getAllTalkers');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const FILENAME = 'talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Requisito 01
app.get('/talker', getAllTalkers);

// Requisito 03
app.post('/login',
  emailValidation,
  passwordValidation,
  (req, res) => res.status(HTTP_OK_STATUS).json({ token: crypto.randomBytes(8).toString('hex') }));

// Requisito 04
app.post('/talker',
  authValidation,
  nameValidation,
  ageValidation,
  talkKeyValidation,
  rateValidation,
  dateValidation,
  async (req, res) => {
  const { name, age, talk } = req.body;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const newTalker = { id: (talkers.length + 1), name, age, talk };

  talkers.push(newTalker);
  await fs.writeFile(FILENAME, JSON.stringify(talkers));
  return res.status(201).json({ id: (talkers.length + 1), ...newTalker });
});

// Requisito 07
app.get('/talker/search', authValidation, async (req, res) => {
  const { q } = req.query;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const findTalkers = talkers.filter((talker) => talker.name.includes(q));
  return res.status(HTTP_OK_STATUS).json(findTalkers);
});

// Requisito 02
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await fs.readFile(FILENAME, 'utf-8');
  const talker = JSON.parse(data).find((talk) => talk.id === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(talker);
});

// Requisito 05
app.put('/talker/:id',
  authValidation,
  nameValidation,
  ageValidation,
  talkKeyValidation,
  rateValidation,
  dateValidation,
  async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
  const editedTalker = { id: Number(id), name, age, talk };
  talkers[talkerIndex] = editedTalker;

  await fs.writeFile(FILENAME, JSON.stringify(talkers));
  return res.status(HTTP_OK_STATUS).json(editedTalker);
});

// Requisito 06
app.delete('/talker/:id', authValidation, async (req, res) => {
  const { id } = req.params;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const undeletedTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await fs.writeFile(FILENAME, JSON.stringify(undeletedTalkers));
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
