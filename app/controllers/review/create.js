const Review = require("../../models/review.model");
const LogService = require("../../services/log.service");
const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");

const create = async (req, res, next) => {
  try {
    const review = new Review({
      title: req.body.title,
      content: req.body.content,
      name: req.body.name,
      email: "fat@gmail.com",
      userId: "61ff6cc107384609ff6e1646",
      status: "accepted",
      star: req.body.star,
      onModel: req.body.onModel,
      modelId: req.body.modelId,
      createdAt: req.body.createdAt,
    });

    if (req.body.replyTo) {
      const parent = await Review.findById(req.body.replyTo);

      review.parentId = req.body.replyTo;
      review.depth = +parent.depth + 1;
      review.onModel = parent.onModel;
      review.modelId = parent.modelId;
    }
    await review.save();

    if (review.onModel === "product") {
      const product = await Product.findOne({ _id: review.modelId });
      product.reviewsCount = product.reviewsCount + 1;
      await product.save();
    }
    if (review.onModel === "brand") {
      const brand = await Brand.findOne({ _id: review.modelId });
      brand.reviewsCount = brand.reviewsCount + 1;
      await brand.save();
    }

    await LogService.create({
      model: "review",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: review._id,
      userId: req.user._id,
    });

    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
