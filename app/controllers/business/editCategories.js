const BusinessBrand = require("../../models/businessBrand.model");

const editCategories = async (req, res, next) => {
  try {
    let businessBrand = await BusinessBrand.findOne({ userId: req.user._id });
    if (businessBrand) {
      businessBrand.categories = req.body.categories;
      businessBrand.status = "pending";
      await businessBrand.save();
    }
    res.status(200).json(businessBrand);
  } catch (err) {
    next(err);
  }
};

module.exports = editCategories;
