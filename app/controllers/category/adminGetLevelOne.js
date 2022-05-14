const Category = require("../../models/category.model");

const adminGetLevelOne = async (req, res, next) => {
  try {
    const categories = await Category.find({
      type: "category",
      level: 1,
    }).sort("-createdAt");

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = adminGetLevelOne;
