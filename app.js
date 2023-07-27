const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017',
} = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`${MONGO_URL}/moviesdb`);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});