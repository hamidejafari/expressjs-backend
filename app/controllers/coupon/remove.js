const Brand = require("../../models/brand.model");
const Coupon = require("../../models/coupon.model");
const Product = require("../../models/product.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params._id);

    await LogService.create({
      model: "coupon",
      url: req.originalUrl,
      method: req.method,
      data: coupon,
      modelId: coupon._id,
      userId: req.user._id,
    });

    await elasticsearchService.delete("coupons", coupon._id);

    const product = await Product.findById(coupon.productId);

    const filteredProductCoupon = product.coupons.filter(function (value) {
      return value.toString() !== coupon._id?.toString();
    });
    

    product.coupons = filteredProductCoupon;

    await product.save();

    const brand = await Brand.findById(product.brandId);

    let hasCoupon = false;
    if (brand) {
      const brandProducts = await Product.find({ brandId: brand._id });

      brandProducts.forEach((brandProduct) => {
        if (
          brandProduct.coupons &&
          Array.isArray(brandProduct.coupons) &&
          brandProduct.coupons.length > 0
        ) {
          hasCoupon = true;
        }
      });
    }

    brand.hasCoupon = hasCoupon;

    await brand.save();

    await coupon.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
