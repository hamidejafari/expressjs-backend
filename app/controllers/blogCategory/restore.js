const BlogCategory = require("../../models/blogCategory.model");
const LogService = require("../../services/log.service");

const restore = async (req, res, next) => {
  try {
    const blogCategory = await BlogCategory.findOneDeleted({
      _id: req.params._id,
    });

    await LogService.create({
      model: "blogCategory",
      url: req.originalUrl,
      method: req.method,
      data: blogCategory,
      modelId: blogCategory._id,
      userId: req.user._id,
    });

    await blogCategory.restore();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = restore;
