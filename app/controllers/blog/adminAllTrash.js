const Blog = require("../../models/blog.model");

const adminAllTrash = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const blogs = await Blog.findDeleted({})
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("blogCategoryId")
      .populate("categoryId");
    const count = await Blog.findDeleted({}).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: blogs, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllTrash;
