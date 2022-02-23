const express = require('express');
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
  // Exercicio bonus 22.4
  return res.status(200).json({ token: crypto.randomBytes(8).toString('hex') });
});

// Requisito 04
app.post('/talker', async (req, res) => {
  const { name, age, talk } = req.body;

  // Validação de token
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  // Validação de nome
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  // Validação de idade
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

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

app.listen(PORT, () => {
  console.log('Online');
});
