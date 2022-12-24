const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const { SUCCESS_OK } = require('../utils/constants');
const { CREATED } = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

// возвращает всех фильмов
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
    })
    .catch(next);
};

// создаем фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const userId = req.user._id; // работает?

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    userId,
  })
    .then((data) => { // исправить или оставить так?
      res.status(CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  Movie.findById(req.params.movieId)
    .then((data) => {
      if (!data) {
        throw new NotFound('Фильм не найден');
      }
      if (!data.owner.equals(userId)) {
        throw new Forbidden('Нельзя удалить чужой фильм');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((movie) => {
          res.status(SUCCESS_OK).send({ movie });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
