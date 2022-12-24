const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EmailError = require('../errors/EmailError');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const { SUCCESS_OK } = require('../utils/constants');
const { CREATED } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// Получение информации о пользователе
const getUserInfo = (req, res, next) => { // Проверить что возвращается ( нужно вернуть email и имя)
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь не найден'));
      }
      return res.status(SUCCESS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Обновляет профиль
const updateUserInfo = (req, res, next) => { // Проверить, все ли работает корректно
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate({ id: userId }, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Авторизоваться
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

// Регистрация
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(CREATED).send({
            name: user.name,
            email: user.email,
            _id: user._id,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest('Неправильные, некорректные данные'));
          } else if (err.code === 11000) {
            next(new EmailError('Email уже используется'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  login,
  createUser,
};
