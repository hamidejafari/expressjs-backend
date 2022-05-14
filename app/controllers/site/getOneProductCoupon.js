const Product = require("../../models/product.model");

const getOneProductCoupon = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      active: true,
      published: true,
      slug: req.params.categorySlug + "/" + req.params.brandSlig,
    })
      .populate("coupons")
      .lean();

    let maxDiscount = 0;
    let maxExpirationDate = new Date(product.coupons[0].expireDate);
    product.coupons.forEach((coupon) => {
      if (
        new Date() < new Date(coupon.expireDate) &&
        coupon.amount > maxDiscount
      ) {
        maxDiscount = coupon.amount;
      }

      if (maxExpirationDate < new Date(coupon.expireDate)) {
        maxExpirationDate = coupon.expireDate;
      }
    });

    if (maxDiscount === 0) {
      maxDiscount = product.coupons[product.coupons.length - 1].amount;
    }

    if (maxExpirationDate === new Date()) {
      maxDiscount = product.coupons[product.coupons.length - 1].expireDate;
    }

    product.maxDiscount = maxDiscount;
    product.occasion = product.coupons[product.coupons.length - 1].occasion;
    product.maxExpirationDate = maxExpirationDate;

    return res.json({ product });
  } catch (err) {
    next(err);
  }
};

module.exports = getOneProductCoupon;
