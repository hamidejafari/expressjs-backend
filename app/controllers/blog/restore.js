const Blog = require("../../models/blog.model");
// const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const blog = await Blog.findOneDeleted({ _id: req.params._id });

    await LogService.create({
      model: "blog",
      url: req.originalUrl,
      method: req.method,
      data: blog,
      modelId: blog._id,
      userId: req.user._id,
    });

    await blog.restore();

    // await elasticsearchService.put("blogs", {
    //   _id: blog._id,
    //   title: blog.title,
    //   slug: blog.slug,
    // });

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
