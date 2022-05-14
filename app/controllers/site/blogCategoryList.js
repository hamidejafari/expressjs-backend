const BlogCategory = require("../../models/blogCategory.model");
// const Brand = require("../../models/brand.model");

const blogCategoryDetail = async (req, res, next) => {
  try {

    const blogCategories = await BlogCategory.find();

    res.status(200).json({
        blogCategories: blogCategories
    });
  } catch (err) {
    next(err);
  }
};

module.exports = blogCategoryDetail;