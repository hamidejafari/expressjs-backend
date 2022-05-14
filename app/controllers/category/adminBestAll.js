const Category = require("../../models/category.model");

const adminBestAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const query = { type: "category" };

    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }
    if (req.query.categoryIds) {
      req.query.categoryIds = req.query.categoryIds.split(",");
      query.parentId = { $in: req.query.categoryIds };
    }
    query._id = { $in: req.categoryIds };

    query.level = 3;

    const categories = await Category.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("parentId")
      .populate("products._id")
      .populate("draftProducts._id");


    const count = await Category.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: categories, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminBestAll;
