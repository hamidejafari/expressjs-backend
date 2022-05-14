const Tag = require("../../models/tag.model");

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

    const tags = await Tag.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");

    const count = await Tag.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: tags, meta: { count, lastPage } });
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = adminAll;
