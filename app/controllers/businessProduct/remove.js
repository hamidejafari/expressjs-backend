const LogService = require("../../services/log.service");
const BusinessProduct = require("../../models/businessProduct.model");

const remove = async (req, res, next) => {
  try {
    const product = await BusinessProduct.findById(req.params._id);

    await LogService.create({
      model: "businessProduct",
      url: req.originalUrl,
      method: req.method,
      data: product,
      modelId: product._id,
      userId: req.user._id,
    });


    await product.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
