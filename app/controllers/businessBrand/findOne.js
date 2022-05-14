const BusinessBrand = require("../../models/businessBrand.model");

const findOne = async (req, res, next) => {
  try {
    const businessBrand = await BusinessBrand.findOne({
      _id: req.params._id,
    })
      .populate("brandId")
      .populate("categories");
    res.status(200).json(businessBrand);
  } catch (err) {
    next(err);
  }
};

module.exports = findOne;
