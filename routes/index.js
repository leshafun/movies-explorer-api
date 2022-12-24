const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const userRouter = require('./users');
const moviesRouter = require('./movies');
const { auth } = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const { login, createUser } = require('../controllers/users');

router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth, (req, res, next) => {
  const error = new NotFound('Страница не найдена');
  next(error);
});

module.exports = router;
