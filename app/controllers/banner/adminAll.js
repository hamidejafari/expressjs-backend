const Banner = require("../../models/banner.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 100;
  const page = +req.query.page - 1 || 0;

  try {
    const banner = await Banner.find({})
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("modelId");

    const count = await Banner.find({}).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: banner, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
