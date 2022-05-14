const Coupon = require("../../models/coupon.model");

const adminAllTrash = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const coupon = await Coupon.findDeleted({})
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("modelId");
    const count = await Coupon.findDeleted({}).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: coupon, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllTrash;
