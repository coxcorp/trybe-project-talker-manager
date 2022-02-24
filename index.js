const express = require('express');
const fs = require('fs').promises;
const authValidation = require('./middlewares/auth');
const nameValidation = require('./middlewares/nameValidation');
const ageValidation = require('./middlewares/ageValidation');

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
app.get('/talker', async (req, res) => {
  const data = await fs.readFile(FILENAME, 'utf-8');
  return res.status(HTTP_OK_STATUS).json(JSON.parse(data));
});

// Requisito 07
app.get('/talker/search', authValidation, async (req, res) => {
  const { q } = req.query;

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const findTalkers = talkers.filter((talker) => talker.name.includes(q));
  return res.status(200).json(findTalkers);
});

// Requisito 02
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await fs.readFile(FILENAME, 'utf-8');
  const talker = JSON.parse(data).find((talk) => talk.id === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(talker);
});

// Requisito 03
const crypto = require('crypto');

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /\S+@\S+\.\S+/;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  // Exercicio bonus 22.4
  return res.status(200).json({ token: crypto.randomBytes(8).toString('hex') });
});

// Requisito 04
app.post('/talker', authValidation, nameValidation, ageValidation, async (req, res) => {
  const { name, age, talk } = req.body;

  // Verificação da chave talk
  if (!talk || talk.rate === undefined || !talk.watchedAt) {
    return res.status(400).json({ 
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  // Validação de rate entre 1 e 5
  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  // Validação do formato de data
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!dateRegex.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const newTalker = { id: (talkers.length + 1), name, age, talk };

  talkers.push(newTalker);
  await fs.writeFile(FILENAME, JSON.stringify(talkers));
  return res.status(201).json({ id: (talkers.length + 1), ...newTalker });
});

// Requisito 05
app.put('/talker/:id', authValidation, nameValidation, ageValidation, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  // Verificação da chave talk
  if (!talk || talk.rate === undefined || !talk.watchedAt) {
    return res.status(400).json({ 
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  // Validação de rate entre 1 e 5
  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  // Validação do formato de data
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!dateRegex.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  const data = await fs.readFile(FILENAME, 'utf-8');
  const talkers = JSON.parse(data);
  const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
  const editedTalker = { id: Number(id), name, age, talk };
  talkers[talkerIndex] = editedTalker;

  await fs.writeFile(FILENAME, JSON.stringify(talkers));
  return res.status(200).json(editedTalker);
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
