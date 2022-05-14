const BusinessProduct = require("../../models/businessProduct.model");

const findOne = async (req, res, next) => {
  try {
    const businessProduct = await BusinessProduct.findOne({
      _id: req.params._id,
    })
      .populate("productId")
      .populate("categoryId");
    res.status(200).json(businessProduct);
  } catch (err) {
    next(err);
  }
};

module.exports = findOne;
