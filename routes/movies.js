const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
moviesRouter.get('/movies', getMovies);

// создаёт фильм
moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/i),
    trailer: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/i),
    thumbnail: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/i),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм по id
moviesRouter.delete('/movies/_id', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
