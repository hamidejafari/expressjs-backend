const Coupon = require("../../models/coupon.model");

const all = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params._id }).populate(
      "productId"
    );
    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
