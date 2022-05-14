const Product = require("../../models/product.model");

const addAttribute = async (req, res, next) => {
  try {
    // const product = await Product.findOne({ _id: req.params._id });

    const attributes = req.body.attributes;

    const ids = [];

    for (const variable in attributes) {
      ids.push(variable);
    }

    const products = await Product.find({ _id: { $in: ids } });

    for await (const product of products) {
      product.attributes = attributes[product._id.toString()];
      await product.save();
    }

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = addAttribute;
