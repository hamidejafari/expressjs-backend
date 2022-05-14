const Product = require("../../models/product.model");
const Redirect = require("../../models/redirect.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const updateSlug = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params._id);

    const redirect = new Redirect({
      newAddress: req.body.slug,
      oldAddress: product.slug,
    });

    await redirect.save();

    product.slug = req.body.slug;

    await product.save();

    await LogService.create({
      model: "product",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: product._id,
      userId: req.user._id,
    });

    if (product.published && product.active) {
      const body = {
        _id: product._id,
        title: product.title,
        slug: req.body.slug,
      };

      if (product?.image?.fileName) {
        body.image = "files/images/small/" + product?.image?.fileName;
      }
      await elasticsearchService.put("products", body);
    } else {
      await elasticsearchService.delete("products", product._id);
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = updateSlug;
