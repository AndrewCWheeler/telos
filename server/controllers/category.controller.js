const { Category } = require('../models/category.model');
const { User } = require('../models/user.model');

module.exports = {

  // Read methods --> app.get
  allUserCategories: (req, res) => {
    Category.find({ owner: req.session.userId })
      .populate('categories')
      .then(categories => res.json({ message: 'success', results: categories }))
      .catch(err => res.json({ message: 'error', results: err }));
  },
  oneCategory: (req, res) => {
    Category.findOne({ _id: req.params.id })
      .then(category => res.json({ message: 'success', results: category }))
      .catch(err => res.json({ message: 'error', results: err }));
  },

  //Create methods --> app.post
  newCategory: (req, res) => {
    Category.create(req.body)
      .then(category => {
        return User.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { categories: category._id }},
          { new: true}
        );
      })
      .then(category => res.json({ message: 'success', results: category }))
      .catch(err => res.json({ message: 'error', results: err }));
  },

  //Update methods --> app.put or app.patch
  editCategory: (req, res) => {
    Category.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      runValidators: true,
      new: true,
      useFindAndModify: false,
    })
      .then(category => res.json({ message: 'success', results: category }))
      .catch(err => res.json({ message: 'error', results: err }));
  },

  //Delete methods --> app.delete
  deleteCategory: (req, res) => {
    Category.findByIdDelete({ _id: req.params.id })
      .then(category => res.json({ message: 'success', results: category }))
      .catch(err => res.json({ message: 'error', results: err }));
  },
};
