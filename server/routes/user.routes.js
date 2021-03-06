const UserController = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');
const userController = require('../controllers/user.controller');
const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.json(err => ({ message: 'error', results: err }));
  } else {
    next();
  }
};
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.json(err => ({ message: 'error', results: err }));
  } else {
    next();
  }
};

module.exports = app => {
  app.post('/api/register', redirectHome, UserController.register);
  app.post('/api/login', redirectHome, UserController.login);
  app.get('/api/users', authenticate, UserController.getAll);
  app.get('/api/users/one', authenticate, UserController.oneUser);
  app.patch('/api/users/one', authenticate, UserController.editUser);
  app.get('/api/user/tasks', authenticate, UserController.getAllUserTasks);
  app.patch('/api/user/tasks', authenticate, UserController.updateTasks);
  app.get('/api/user/categories', authenticate, UserController.getAllUserCategories);
  app.delete('/api/users/:id', authenticate, UserController.deleteUser);
  app.get(
    '/api/users/logout',
    authenticate,
    redirectLogin,
    UserController.logout
  );
};
