const Review = require("../../models/review.model");
const removeReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params._id);
    await review.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = removeReview;