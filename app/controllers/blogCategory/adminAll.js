const BlogCategory = require("../../models/blogCategory.model");

const adminAll = async (req, res, next) => {
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

    const blogCategories = await BlogCategory.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("categoryId");
    const count = await BlogCategory.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: blogCategories, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
