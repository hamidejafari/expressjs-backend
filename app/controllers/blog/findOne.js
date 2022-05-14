const Blog = require("../../models/blog.model");

const all = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params._id }).populate("blogCategoryId").populate("categoryId");
    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
