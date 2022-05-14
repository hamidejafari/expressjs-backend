const Category = require("../../models/category.model");

const adminGetLevelOneAndTwoSelect = async (req, res, next) => {
  try {
    const categories = await Category.find({
      type: "category",
      level: { $in: [1, 2] },
      _id: { $in: req.categoryIds },
    }).select("title");

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = adminGetLevelOneAndTwoSelect;
