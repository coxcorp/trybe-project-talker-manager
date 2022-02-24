const express = require('express');
const authValidation = require('./middlewares/auth');
const nameValidation = require('./middlewares/nameValidation');
const ageValidation = require('./middlewares/ageValidation');
const talkKeyValidation = require('./middlewares/talkKeyValidation');
const rateValidation = require('./middlewares/rateValidation');
const dateValidation = require('./middlewares/dateValidation');
const emailValidation = require('./middlewares/emailValidation');
const passwordValidation = require('./middlewares/passwordValidation');
const getAllTalkers = require('./controllers/getAllTalkers');
const getTalkerById = require('./controllers/getTalkerById');
const login = require('./controllers/login');
const createTalker = require('./controllers/createTalker');
const editTalker = require('./controllers/editTalker');
const deleteTalker = require('./controllers/deleteTalker');
const searchTalker = require('./controllers/searchTalker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

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
  login);

// Requisito 04
app.post('/talker',
  authValidation,
  nameValidation,
  ageValidation,
  talkKeyValidation,
  rateValidation,
  dateValidation,
  createTalker);

// Requisito 07
app.get('/talker/search', authValidation, searchTalker);

// Requisito 02
app.get('/talker/:id', getTalkerById);

// Requisito 05
app.put('/talker/:id',
  authValidation,
  nameValidation,
  ageValidation,
  talkKeyValidation,
  rateValidation,
  dateValidation,
  editTalker);

// Requisito 06
app.delete('/talker/:id', authValidation, deleteTalker);

app.listen(PORT, () => {
  console.log('Online');
});
