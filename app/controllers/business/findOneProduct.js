const BusinessProduct = require("../../models/businessProduct.model");

const findOneProduct = async (req, res, next) => {
  try {

    const product = await BusinessProduct.findOne({ _id: req.params._id }).populate("categoryId")
      .populate("businessBrandId");

    res.status(200).json(product);
    
  } catch (err) {
    next(err);
  }
};

module.exports = findOneProduct;