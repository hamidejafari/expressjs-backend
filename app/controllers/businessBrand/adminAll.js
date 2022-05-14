const BusinessBrand = require("../../models/businessBrand.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = { status: { $ne: "created by brandsreviews" } };
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }

    const brands = await BusinessBrand.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("brandId");

    const count = await BusinessBrand.find(query).count();
    const lastPage = Math.ceil(count / perPage);
    res.status(200).json({ data: brands, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
