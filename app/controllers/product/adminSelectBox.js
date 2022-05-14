const Product = require("../../models/product.model");

const adminSelectBox = async (req, res, next) => {
  try {
    const products = await Product.find({
      categoryId: { $in: req.categoryIds },
    })
      .select({ title: 1 })
      .sort("title");

    res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
};

module.exports = adminSelectBox;
