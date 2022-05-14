const Brand = require("../../models/brand.model");
const Category = require("../../models/category.model");

const parents = async (req, res, next) => {
  try {
    const brands = await Brand.find()
      .select({ title: 1, slug: 1 })
      .sort("title");
    const categories = await Category.find({
      level: 3,
      _id: { $in: req.categoryIds },
    })
      .select({ title: 1, slug: 1 })
      .sort("title");
    res.status(200).json({
      brands: brands,
      categories: categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = parents;
