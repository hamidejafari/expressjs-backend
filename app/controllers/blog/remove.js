const Blog = require("../../models/blog.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params._id);

    const relateds = await Blog.find({
      relatedBlogs: { $elemMatch: { $eq: req.params._id } },
    });

    if (relateds.length > 0) {
      const data = relateds.map((related) => related.title);

      return res.status(400).json({
        message: "you cannot delete this becouse it has relation",
        data,
      });
    }

    await LogService.create({
      model: "blog",
      url: req.originalUrl,
      method: req.method,
      data: blog,
      modelId: blog._id,
      userId: req.user._id,
    });

    await blog.delete();

    await elasticsearchService.delete("blogs", blog._id);

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
