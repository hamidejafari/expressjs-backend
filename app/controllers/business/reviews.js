const BusinessBrand = require("../../models/businessBrand.model");
const Review = require("../../models/review.model");
const Product = require("../../models/product.model");

const reviews = async (req, res, next) => {
  try {
    let reviews = [];
    const perPage = +req.query.perPage || 10;
    const page = +req.query.page - 1 || 0;
    let count;
    let lastPage;

    const businessBrand = await BusinessBrand.findOne({ userId: req.user._id });
    if (businessBrand && businessBrand?.brandId) {
      if (req.query.onModel) {
        if (req.query.onModel === "brand") {
          reviews = await Review.find({
            onModel: "brand",
            modelId: businessBrand.brandId,
          })
            .skip(page * perPage)
            .limit(perPage)
            .sort("-createdAt");

          count = await Review.find({
            onModel: "brand",
            modelId: businessBrand.brandId,
          }).count();
          lastPage = Math.ceil(count / perPage);
        } else if (req.query.onModel === "product") {
          const products = await Product.find({
            brandId: businessBrand?.brandId,
          }).select("title");
          const productIds = [];
          products.forEach((item) => {
            products.push(item._id);
          });
          reviews = await Review.find({
            onModel: "product",
            modelId: { $in: productIds },
          })
            .skip(page * perPage)
            .limit(perPage)
            .sort("-createdAt");

          count = await Review.find({
            onModel: "product",
            modelId: { $in: productIds },
          }).count();
          lastPage = Math.ceil(count / perPage);
        }
      } else {
        const products = await Product.find({
          brandId: businessBrand?.brandId,
        }).select("title");
        const productIds = [];
        products.forEach((item) => {
          products.push(item._id);
        });

        reviews = await Review.find({
          $or: [
            { modelId: { $in: productIds } },
            { modelId: businessBrand.brandId },
          ],
        })
          .skip(page * perPage)
          .limit(perPage)
          .sort("-createdAt");

        count = await Review.find({
          $or: [
            { modelId: { $in: productIds } },
            { modelId: businessBrand.brandId },
          ],
        }).count();
        lastPage = Math.ceil(count / perPage);
      }
    }
    res.status(200).json({
      reviews: reviews,
      meta: { count, lastPage },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = reviews;
