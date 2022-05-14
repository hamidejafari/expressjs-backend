const Brand = require("../../models/brand.model");
const Category = require("../../models/category.model");
const Product = require("../../models/product.model");

const getOneBrandCoupon = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({
      active: true,
      published: true,
      slug: req.params.slug,
    }).lean();

    if (brand) {
      const products = await Product.find({
        active: true,
        published: true,
        brandId: brand._id,
        "coupons.0": { $exists: true },
      })
        .populate("coupons")
        .lean();

      products.forEach((product) => {
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
      });

      const category = await Category.findOne({
        active: true,
        _id: brand.categories[0]._id,
        published: true,
      })
        .populate("brands._id")
        .select("title brands");

      return res.json({ brand, products, category, type: "brand" });
    } else {
      return res.json({ type: "product" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getOneBrandCoupon;
