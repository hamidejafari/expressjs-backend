const LogService = require("../../services/log.service");
const BusinessBrand = require("../../models/businessBrand.model");

const remove = async (req, res, next) => {
  try {
    const brand = await BusinessBrand.findById(req.params._id);

    await LogService.create({
      model: "businessBrand",
      url: req.originalUrl,
      method: req.method,
      data: brand,
      modelId: brand._id,
      userId: req.user._id,
    });


    await brand.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
