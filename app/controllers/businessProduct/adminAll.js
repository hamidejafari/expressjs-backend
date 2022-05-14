const BusinessProduct = require("../../models/businessProduct.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = { status: { $ne: "created by brandsreviews" } };
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }

    const products = await BusinessProduct.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .populate("productId")
      .sort("-createdAt");
    const count = await BusinessProduct.find(query).count();
    const lastPage = Math.ceil(count / perPage);
    res.status(200).json({ data: products, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
