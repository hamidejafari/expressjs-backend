const Category = require("../../models/category.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const categoryBulkJson = async (req, res) => {
  const categories = await Category.find({
    type: "category",
    active: true,
    published: true,
  });

  for await (const category of categories) {
    const body = {
      _id: category._id,
      title: category.title,
      slug: category.slug,
      level: category.level,
    };

    if (category?.icon?.fileName) {
      body.image = "files/images/small/" + category?.icon?.fileName;
    }
    await elasticsearchService.put("categories", body);
  }

  res.send("done");
};

module.exports = categoryBulkJson;
