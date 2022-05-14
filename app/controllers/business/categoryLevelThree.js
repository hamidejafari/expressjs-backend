const Category = require("../../models/category.model");

const categoryLevelThree = async (req, res, next) => {
  try {
    const categories = await Category.find({
      type: "category",
      level: 3,
    }).select('title');

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = categoryLevelThree;