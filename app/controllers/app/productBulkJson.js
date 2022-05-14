const Product = require("../../models/product.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const productBulkJson = async (req, res) => {
  const products = await Product.find({
    active: true,
    published: true,
  });

  for await (const product of products) {
    const body = {
      _id: product._id,
      title: product.title,
      slug: product.slug,
    };

    if (product?.image?.fileName) {
      body.image = "files/images/small/" + product?.image?.fileName;
    }
    await elasticsearchService.put("products", body);
  }

  res.send("done");
};

module.exports = productBulkJson;
