const BusinessBrand = require("../../models/businessBrand.model");
const LogService = require("../../services/log.service");

const patch = async (req, res, next) => {
  try {
    const businessBrand = await BusinessBrand.findById(req.params._id);

    businessBrand.status = req.body.status;

    await businessBrand.save();

    await LogService.create({
      model: "businessBrand",
      url: req.originalUrl,
      method: req.method,
      data: JSON.stringify(businessBrand),
      modelId: businessBrand._id,
      userId: req.user._id,
    });

    res.status(200).json(businessBrand);
  } catch (err) {
    next(err);
  }
};

module.exports = patch;
