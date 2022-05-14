const nodemailer = require("nodemailer");

const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
const Brand = require("../../models/brand.model");
const LogService = require("../../services/log.service");
const review_accept_template = require("../../helpers/review_accept_template");
const review_denied_template = require("../../helpers/review_denied_template");

const update = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params._id);

    if (req.body.status === "accepted" && req.body.status !== review.status) {
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
    }

    if (req.body.status !== review.status && review.email !== "fat@gmail.com") {
      let template;
      if (req.body.status === "accepted") {
        template = review_accept_template(review.name || "");
      } else if (req.body.status === "denied") {
        template = review_denied_template(review.name || "");
      }
      const transporter = nodemailer.createTransport({
        host: "giowm1158.siteground.biz",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "info@brandsreviews.com",
          pass: "fat2022@email",
        },
      });
      const mailOptions = {
        from: "info@brandsreviews.com",
        to: review.email,
        subject: "Brandsreviws",
        text: "",
        html: template,
      };
      transporter.sendMail(mailOptions);
    }

    review.status = req.body.status;
    review.showHomePage = req.body.showHomePage;
    review.content = req.body.content || review.content;
    review.star = req.body.star;
    review.createdAt = new Date(req.body.createdAt);

    await review.save();

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

module.exports = update;
