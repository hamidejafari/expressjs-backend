const Category = require("../../models/category.model");

const maincatSearch = async (req, res, next) => {
  try {
    const categories = await Category.find({
      title: { $regex: req.query.search.trim(), $options: "i" },
      published: true,
    });
    res.status(200).json({
      categories: categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = maincatSearch;
