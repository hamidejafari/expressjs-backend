const Category = require("../../models/category.model");

const adminAllSelect = async (req, res, next) => {
  try {
    const query = { type: "comparison" };
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }
    if (req.query.slug) {
      query.slug = { $regex: req.query.slug.trim(), $options: "i" };
    }
    const categories = await Category.find(query).sort("-createdAt");

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllSelect;
