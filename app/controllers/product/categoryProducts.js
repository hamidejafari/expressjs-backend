const Product = require("../../models/product.model");

const categoryProducts = async (req, res, next) => {
  const catId = req.query.category;
  try {
    const products = await Product.find({
      extraCategories: { $elemMatch: { $eq: catId } },
    });

    res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
};

module.exports = categoryProducts;
