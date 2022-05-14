const Brand = require("../../models/brand.model");

const couponBrands = async (req, res, next) => {
  try {
    const perPage = +req.query.perPage || 20;
    const page = +req.query.page - 1 || 0;

    const query = { hasCoupon: true, published: true, active: true };
    const brands = await Brand.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-title")
      .select("title image slug");

    const count = await Brand.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.json({ data: brands, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = couponBrands;
