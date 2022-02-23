const express = require('express');
// const bodyParser = require('body-parser');
const fs = require('fs').promises;

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
  function generateToken() {
    return crypto.randomBytes(8).toString('hex');
  }
  return res.status(200).json({ token: generateToken() });
});

app.listen(PORT, () => {
  console.log('Online');
});
