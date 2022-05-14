const Category = require("../../models/category.model");

const findOne = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params._id });

    res.status(200).json(category);

  } catch (err) {
    next(err);
  }
};

module.exports = findOne;
