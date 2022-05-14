const Category = require("../../models/category.model");

const adminGetLevelTwo = async (req, res, next) => {
  try {
    const categories = await Category.find({
      type: "category",
      _id: { $in: req.categoryIds },
      level: 2,
    }).sort("-createdAt");

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = adminGetLevelTwo;
