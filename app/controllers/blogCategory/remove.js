const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blogCategory.model");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const blogCategory = await BlogCategory.findById(req.params._id);

    const relateds = await Blog.find({
      blogCategoryId: req.params._id,
    });

    if (relateds.length > 0) {
      const data = relateds.map((related) => related.title);
      return res.status(400).json({
        message: "you cannot delete this becouse it has relation",
        data,
      });
    }

    await LogService.create({
      model: "blogCategory",
      url: req.originalUrl,
      method: req.method,
      data: blogCategory,
      modelId: blogCategory._id,
      userId: req.user._id,
    });

    await blogCategory.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
