const Product = require("../../models/product.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }
    if (req.query.slug) {
      query.slug = { $regex: req.query.slug.trim(), $options: "i" };
    }
    if (req.query.showHomePage) {
      query.showHomePage = true;
    }

    if (req.query.publishedFilter) {
      query.published = req.query.publishedFilter === "true";
    }
    if (req.query.indexFilter) {
      query.noIndex = req.query.indexFilter === "true";
    }
    if (req.query.activeFilter) {
      query.active = req.query.activeFilter === "true";
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

    const products = await Product.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("categoryId")
      .populate("brandId");
    const count = await Product.find(query).count();
    const lastPage = Math.ceil(count / perPage);
    res.status(200).json({ data: products, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
