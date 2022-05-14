const Product = require("../../models/product.model");

const all = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params._id })
      .populate("categoryId")
      .populate("extraCategories")
      .populate("brandId")
      .populate("tagIds");

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
