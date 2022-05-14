const Category = require("../../models/category.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const query = { type: "category" };
    query._id = { $in: req.categoryIds };
    query.level = 3;
    query.products = { $size: 3 };

    const categories = await Category.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("parentId");

    const count = await Category.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: categories, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
