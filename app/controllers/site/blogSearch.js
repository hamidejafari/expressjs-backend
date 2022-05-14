const Blog = require("../../models/blog.model");

const blogSearch = async (req, res, next) => {
  try {

    const blogs = await Blog.find({
      title: { $regex: req.query.title.trim(), $options: "i" },
    }).populate("blogCategoryId");

    res.status(200).json({
        blogs:blogs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = blogSearch;