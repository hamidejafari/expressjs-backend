const BlogCategory = require("../../models/blogCategory.model");

const all = async (req, res, next) => {
  try {
    const blogCategory = await BlogCategory.findOne({ _id: req.params._id }).populate("categoryId");
    res.status(200).json(blogCategory);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
