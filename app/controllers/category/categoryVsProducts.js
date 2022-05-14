const Products = require("../../models/product.model");
const Comparison = require("../../models/comparison.model");

const categoryVsProducts = async (req, res, next) => {
  try {
    const products = await Products.find({
      categoryId: req.params._id,
    }).sort("-createdAt");

    const comparisons = await Comparison.find({
      categoryId: req.params._id,
      onModel: "product",
    });

    const selectedProducts = [];

    comparisons.forEach((comparison) => {
      selectedProducts.push(comparison.compare1Id.toString());
      selectedProducts.push(comparison.compare2Id.toString());
    });

    const uniqSelectedProducts = [...new Set(selectedProducts)];

    res.status(200).json({ products, selectedProducts: uniqSelectedProducts });
  } catch (err) {
    next(err);
  }
};

module.exports = categoryVsProducts;
