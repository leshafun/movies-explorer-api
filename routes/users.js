const userRouter = require('express').Router();
const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

// Получение информации о пользователе
userRouter.get('/me', getUserInfo);

// обновляет профиль
userRouter.patch('/me', updateUserInfo);

module.exports = userRouter;
