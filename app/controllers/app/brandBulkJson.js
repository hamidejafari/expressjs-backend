const Brand = require("../../models/brand.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const brandBulkJson = async (req, res) => {
  const brands = await Brand.find({ published: true });

  for await (const brand of brands) {
    const body = {
      _id: brand._id,
      title: brand.title,
      slug: brand.slug,
      searchTags: brand.searchTags,
    };

    if (brand?.image?.fileName) {
      body.image = "files/images/small/" + brand?.image?.fileName;
    }
    await elasticsearchService.put("brands", body);
  }

  res.send("done");
};

module.exports = brandBulkJson;
