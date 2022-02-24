const express = require('express');
const emailValidation = require('./middlewares/emailValidation');
const passwordValidation = require('./middlewares/passwordValidation');
const login = require('./controllers/login');
const talkerRouter = require('./routes/talkerRouter');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Requisito 03 - Não passa pela rota Talker
app.post('/login',
  emailValidation,
  passwordValidation,
  login);

app.use('/talker', talkerRouter);

app.listen(PORT, () => {
  console.log('Online');
});
