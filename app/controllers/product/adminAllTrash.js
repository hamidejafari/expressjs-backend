const Product = require("../../models/product.model");

const adminAllTrash = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.slug) {
      query.slug = { $regex: req.query.slug, $options: "i" };
    }

    if (req.query.categoryIds) {
      req.query.categoryIds = req.query.categoryIds.split(",");
      query.categoryId = { $in: req.query.categoryIds };
    } else {
      query.categoryId = { $in: req.categoryIds };
    }
    if (req.query.brandIds) {
      req.query.brandIds = req.query.brandIds.split(",");
      query.brandId = { $in: req.query.brandIds };
    }

    const products = await Product.findDeleted(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("categoryId")
      .populate("brandId");
    const count = await Product.findDeleted(query).count();
    const lastPage = Math.ceil(count / perPage);
    res.status(200).json({ data: products, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllTrash;
