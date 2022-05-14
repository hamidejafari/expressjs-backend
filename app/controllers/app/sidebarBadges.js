const Review = require("../../models/review.model");
const Contact = require("../../models/contact.model");

const sidebarBadges = async (req, res, next) => {
  try {
    const productReviewsCount = await Review.find({
      onModel: "product",
      status: "pending",
    }).count();
    const brandReviewsCount = await Review.find({
      onModel: "brand",
      status: "pending",
    }).count();
    const blogReviewsCount = await Review.find({
      onModel: "blog",
      status: "pending",
    }).count();
    const contactsCount = await Contact.find({ hasRead: false }).count();
    res
      .status(200)
      .json({
        productReviewsCount,
        brandReviewsCount,
        blogReviewsCount,
        contactsCount,
      });
  } catch (err) {
    next(err);
  }
};

module.exports = sidebarBadges;
