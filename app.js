const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const { validateCreateUser, validateLogin } = require('./middlewares/validator');
const auth = require('./middlewares/auth');
const centralizedErrorHandler = require('./middlewares/centralized-error-handler');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017',
} = process.env;
const app = express();
app.use(cors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`${MONGO_URL}/moviesdb`);

app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('/', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
