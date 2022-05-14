const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const LogService = require("../../services/log.service");

const sortProduct = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.categoryId);
    const sort = req.body.sortObject;
    category.products = sort[0];
    category.draftProducts = [sort[1], sort[2]];

    sort[0].forEach(async (element) => {
      const product = await Product.findById(element._id);
      product.categoryStanding = element.standing;
      product.categoryId = category._id;
      await product.save();
    });

    if (Array.isArray(category.products) && category.products.length > 0) {
      category.isActive = true;
      const products = await Product.find({
        categoryId: category._id,
        active: false,
      });
      for await (const product of products) {
        product.active = true;
        await product.save();
      }

      const parent = await Category.findById(category.parentId);
      if (!parent.acive) {
        parent.active = true;
        await parent.save();
      }

      category.active = true;
    }

    await category.save();

    await LogService.create({
      model: "category",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: category._id,
      userId: req.user._id,
    });

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = sortProduct;
