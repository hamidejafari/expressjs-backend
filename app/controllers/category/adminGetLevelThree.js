const Category = require("../../models/category.model");

const adminGetLevelThree = async (req, res, next) => {
  try {
    const categories = await Category.find({
      type: "category",
      level: 3,
      _id: { $in: req.categoryIds },
    }).sort("-createdAt");

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = adminGetLevelThree;
