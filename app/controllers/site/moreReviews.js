const Review = require("../../models/review.model");

const moreReviews = async (req, res, next) => {
  const perPage = 5;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {onModel:req.query.onModel,modelId:req.query.modelId,status:"accepted"};
    const reviews = await Review.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");
    const count = await Review.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: reviews, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = moreReviews;