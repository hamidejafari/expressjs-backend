const Coupon = require("../../models/coupon.model");
const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const create = async (req, res, next) => {
  try {
    const coupon = new Coupon({
      title: req.body.title,
      amount: req.body.amount,
      occasion: req.body.occasion,
      // titleSeo: req.body.titleSeo,
      // descriptionSeo: req.body.descriptionSeo,
      productId: req.body.productId,
      code: req.body.code,
      expireDate: req.body.expireDate,
      showHomePage: req.body.showHomePage,
    });

    await coupon.save();

    const product = await Product.findById(req.body.productId);

    if (product) {
      if (product.coupons && Array.isArray(product.coupons)) {
        product.coupons.push(coupon._id);
      } else {
        product.coupons = [];
        product.coupons.push(coupon._id);
      }

      await product.save();

      const brand = await Brand.findById(product.brandId);

      if (brand) {
        brand.hasCoupon = true;
        await brand.save();
      }
    }

    await LogService.create({
      model: "coupon",
      url: req.originalUrl,
      method: req.method,
      data: coupon,
      modelId: coupon._id,
      userId: req.user._id,
    });

    await elasticsearchService.put("coupons", {
      _id: coupon._id,
      title: coupon.title,
      productId: coupon.productId,
      productTitle: coupon.productTitle,
    });

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
