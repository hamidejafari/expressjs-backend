const Product = require("../../models/product.model");

const allProducts = async (req, res, next) => {
  let catId;
  if (req.query.category) {
    catId = [req.query.category];
  } else {
    catId = req.categoryIds;
  }
  try {
    const products = await Product.find({
      categoryId: { $in: catId },
    });
    res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
};

module.exports = allProducts;
