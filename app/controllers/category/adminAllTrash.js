const Category = require("../../models/category.model");

const adminAllTrash = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const query = { type: "category" };
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }
    if (req.query.level) {
      query.level = req.query.level;
    }

    if (req.query.slug) {
      query.slug = { $regex: req.query.slug.trim(), $options: "i" };
    }

    if (req.query.categoryIds) {
      req.query.categoryIds = req.query.categoryIds.split(",");
      query.parentId = { $in: req.query.categoryIds };
    }

    const categories = await Category.findDeleted(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("parentId");

    const count = await Category.findDeleted(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: categories, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllTrash;
