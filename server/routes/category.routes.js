const CategoryController = require('../controllers/category.controller');
const { authenticate } = require('../config/jwt.config');
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.json(err => ({ message: 'error', results: err }));
  } else {
    next();
  }
};

module.exports = app => {
  app.get(
    '/api/categories/user',
    authenticate,
    redirectLogin,
    CategoryController.allUserCategories
  );
  app.get('/api/categories/:id', authenticate, CategoryController.oneCategory);
  app.post('/api/categories/:id', authenticate, CategoryController.newCategory);
  app.patch('/api/categories/:id', authenticate, CategoryController.editCategory);
  app.delete('/api/categories/:id', authenticate, CategoryController.deleteCategory);
};
