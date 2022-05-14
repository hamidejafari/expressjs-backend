const Coupon = require("../../models/coupon.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const coupon = await Coupon.find({})
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("productId");
    const count = await Coupon.find({}).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: coupon, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
