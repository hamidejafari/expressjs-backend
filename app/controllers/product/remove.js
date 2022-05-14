const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
// const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params._id);

    const relatedCategory = await Category.find({
      brands: { $elemMatch: { _id: req.params._id } },
    });

    if (relatedCategory.length > 0) {
      const data = relatedCategory.map((related) => related.title);
      return res.status(400).json({
        message: "you cannot delete this becouse it has relation",
        data,
      });
    }

    await LogService.create({
      model: "product",
      url: req.originalUrl,
      method: req.method,
      data: product,
      modelId: product._id,
      userId: req.user._id,
    });

    await product.delete();

    // await elasticsearchService.delete("products", product._id);

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
