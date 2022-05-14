const Brand = require("../../models/brand.model");

const adminAllTrash = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }
    if (req.query.slug) {
      query.slug = { $regex: req.query.slug.trim(), $options: "i" };
    }
    if (req.query.special) {
      query.special = req.query.special;
    }

    if (req.query.categoryIds) {
      req.query.categoryIds = req.query.categoryIds.split(",");
      query.categories = {
        $elemMatch: { _id: { $in: req.query.categoryIds } },
      };
    }

    const brands = await Brand.findDeleted(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");
    const count = await Brand.findDeleted(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: brands, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllTrash;
