const Category = require("../../models/category.model");

const adminAllSelect = async (req, res, next) => {
  try {
    const categories = await Category.find({
      type: "category",
    })
      .select({ title: 1 })
      .sort("title");

    res.status(200).json({
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllSelect;
