const BusinessProduct = require("../../models/businessProduct.model");
const LogService = require("../../services/log.service");

const patch = async (req, res, next) => {
  try {
    const businessProduct = await BusinessProduct.findById(req.params._id);

    businessProduct.status = req.body.status;

    await businessProduct.save();

    await LogService.create({
      model: "businessProduct",
      url: req.originalUrl,
      method: req.method,
      data: JSON.stringify(businessProduct),
      modelId: businessProduct._id,
      userId: req.user._id,
    });

    res.status(200).json(businessProduct);
  } catch (err) {
    next(err);
  }
};

module.exports = patch;
