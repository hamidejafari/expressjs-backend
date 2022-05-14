const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");
const Review = require("../../models/review.model");

const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params._id);

    if(review.onModel === "product"){
        const product = await Product.findById(review.modelId);
        product.reviewsCount = product.reviewsCount-1;
        await product.save();
    }

    if(review.onModel === "brand"){
        const brand = await Brand.findById(review.modelId);
        brand.reviewsCount = brand.reviewsCount-1;
        await brand.save();
    }

    await LogService.create({
      model: "review",
      url: req.originalUrl,
      method: req.method,
      data: review,
      modelId: review._id,
      userId: req.user._id,
    });

    await review.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
