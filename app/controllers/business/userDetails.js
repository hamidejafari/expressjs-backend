const User = require("../../models/user.model");
const BusinessBrand = require("../../models/businessBrand.model");

const userDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const businessBrand = await BusinessBrand.findOne({ userId : user._id}).populate("categories").populate("brandId");

    res.status(200).json({
      user: user,
      brand: businessBrand
    });
  } catch (err) {
    next(err);
  }
};

module.exports = userDetails;