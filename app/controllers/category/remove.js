const Category = require("../../models/category.model");
const LogService = require("../../services/log.service");
const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const remove = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params._id);

    // if (category.icon) {
    //   UploadService.deleteFile(category.icon);
    // }

    await LogService.create({
      model: "category",
      url: req.originalUrl,
      method: req.method,
      data: category,
      modelId: category._id,
      userId: req.user._id,
    });

    if (category.level === 1 || category.level === 2) {
      const relateds = await Category.find({
        parentId: req.params._id,
      });

      if (relateds.length > 0) {
        const data = relateds.map((related) => related.title);
        return res.status(400).json({
          message: "you cannot delete this becouse it has relation",
          data,
        });
      }

      const relatedBrand = await Brand.find({
        categories: { $elemMatch: { _id: req.params._id } },
      });

      if (relatedBrand.length > 0) {
        const data = relatedBrand.map((related) => related.title);
        return res.status(400).json({
          message: "you cannot delete this becouse it has relation",
          data,
        });
      }
    } else {
      const relatedProduct = await Product.find({
        categoryId: req.params._id,
      });

      if (relatedProduct.length > 0) {
        const data = relatedProduct.map((related) => related.title);
        return res.status(400).json({
          message: "you cannot delete this becouse it has relation",
          data,
        });
      }
    }

    await elasticsearchService.delete("categories", category._id);
    await category.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
