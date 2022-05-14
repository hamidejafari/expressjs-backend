const Category = require("../../models/category.model");

const categoryLevelTwo = async (req, res, next) => {
  try {
    const categories = await Category.find({
      type: "category",
      level: 2,
    }).select('title');

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = categoryLevelTwo;