const Review = require("../../models/review.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }
    if (req.query.onModel) {
      query.onModel = req.query.onModel;
    }
    if (req.query.name) {
      query.name = { $regex: req.query.name.trim(), $options: "i" };
    }
    if (req.query.email) {
      query.email = { $regex: req.query.email.trim(), $options: "i" };
    }
    if (req.query.star) {
      query.star = req.query.star;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    let modelIds = [];

    if (req.query.brandIds) {
      req.query.brandIds = req.query.brandIds.split(",");

      req.query.brandIds.forEach((item) => {
        modelIds.push(item);
      });
      query.modelId = { $in: modelIds };
    }

    if (req.query.productIds) {
      req.query.productIds = req.query.productIds.split(",");

      req.query.productIds.forEach((item) => {
        modelIds.push(item);
      });
      query.modelId = { $in: modelIds };
    }

    const reviews = await Review.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("parentId")
      .populate("modelId");

    const count = await Review.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: reviews, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
