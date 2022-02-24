const express = require('express');
const authValidation = require('../middlewares/auth');
const nameValidation = require('../middlewares/nameValidation');
const ageValidation = require('../middlewares/ageValidation');
const talkKeyValidation = require('../middlewares/talkKeyValidation');
const rateValidation = require('../middlewares/rateValidation');
const dateValidation = require('../middlewares/dateValidation');
const getAllTalkers = require('../controllers/getAllTalkers');
const getTalkerById = require('../controllers/getTalkerById');
const createTalker = require('../controllers/createTalker');
const editTalker = require('../controllers/editTalker');
const deleteTalker = require('../controllers/deleteTalker');
const searchTalker = require('../controllers/searchTalker');

const router = express.Router();

// Requisito 01
router.get('/', getAllTalkers);

// Requisito 04
router.post('/',
  authValidation,
  nameValidation,
  ageValidation,
  talkKeyValidation,
  rateValidation,
  dateValidation,
  createTalker);

// Requisito 07
router.get('/search', authValidation, searchTalker);

// Requisito 02
router.get('/:id', getTalkerById);

// Requisito 05
router.put('/:id',
  authValidation,
  nameValidation,
  ageValidation,
  talkKeyValidation,
  rateValidation,
  dateValidation,
  editTalker);

// Requisito 06
router.delete('/:id', authValidation, deleteTalker);

module.exports = router;
