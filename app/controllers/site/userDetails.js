const User = require("../../models/user.model");
const Review = require("../../models/review.model");

const userDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const reviews = await Review.find({ userId: user._id }).limit(100);

    const productsReviews = reviews.filter((value) => {
      return value.onModel == "product";
    });

    const brandsReviews = reviews.filter((value) => {
      return value.onModel == "brand";
    });
    
    const blogsReviews = reviews.filter((value) => {
      return value.onModel == "blog";
    });

    const realUser = {
      _id: user._id,
      name: user.name,
      family: user.family,
      email: user.email,
      reviews: reviews,
      reviewsCount: reviews.length,
      productsReviews: productsReviews,
      productsReviewsCount: productsReviews.length,
      brandsReviews: brandsReviews,
      brandsReviewsCount: brandsReviews.length,
      blogsReviews: blogsReviews,
      blogsReviewsCount: blogsReviews.length
    };

    res.status(200).json(realUser);
  } catch (err) {
    next(err);
  }
};

module.exports = userDetails;
