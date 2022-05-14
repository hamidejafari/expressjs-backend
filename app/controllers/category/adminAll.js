const Category = require("../../models/category.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {
      type: "category",
    };
    if (req.query.title) {
      query.title = { $regex: req.query.title.trim(), $options: "i" };
    }
    if (req.query.level) {
      query.level = req.query.level;
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
      query.parentId = { $in: req.query.categoryIds };
    }

    if (req.query.lessThan5Filter) {
      query.$or = [
        {
          $and: [
            {
              level: { $in: [1, 2] },
            },
            { "brands.5": { $exists: false } },
          ],
        },
        {
          $and: [
            {
              level: 3,
            },
            { "products.5": { $exists: false } },
          ],
        },
      ];
    }

    query._id = { $in: req.categoryIds };

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
