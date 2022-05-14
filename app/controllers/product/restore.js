const Product = require("../../models/product.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const product = await Product.findOneDeleted({ _id: req.params._id });

    await LogService.create({
      model: "product",
      url: req.originalUrl,
      method: req.method,
      data: product,
      modelId: product._id,
      userId: req.user._id,
    });

    await product.restore();

    if (product.published && product.active) {
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
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
