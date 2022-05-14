const BlogCategory = require("../../models/blogCategory.model");

const adminAllTrash = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const blogCategories = await BlogCategory.findDeleted({})
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("categoryId");
    const count = await BlogCategory.findDeleted({}).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: blogCategories, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllTrash;
