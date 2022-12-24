require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');

const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/rateLimit');

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');

const app = express();

app.use('*', cors(options));

app.listen(3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);
app.use(helmet());
app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
