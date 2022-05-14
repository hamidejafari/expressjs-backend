const Blog = require("../../models/blog.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const blogBulkJson = async (req, res) => {
  const blogs = await Blog.find({});

  for await (const blog of blogs) {
    await elasticsearchService.put("blogs", {
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
    });
  }

  res.send("done");
};

module.exports = blogBulkJson;
