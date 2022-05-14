const Brand = require("../../models/brand.model");
var mongoose = require("mongoose");
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
    if (req.query.special) {
      query.special = req.query.special;
    }

    if (req.query.categoryIds) {
      req.query.categoryIds = req.query.categoryIds
        .split(",")
        .map((item) => mongoose.Types.ObjectId(item));

      query.categories = {
        $elemMatch: { _id: { $in: req.query.categoryIds } },
      };
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

    const brands = await Brand.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brandId",
          as: "products",
          pipeline: [
            { $match: { deleted: false } },
            { $project: { title: 1 } },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          titleSeo: { $first: "$titleSeo" },
          reviewsCount: { $first: "$reviewsCount" },
          slug: { $first: "$slug" },
          oldSlug: { $first: "$oldSlug" },
          published: { $first: "$published" },
          active: { $first: "$active" },
          image: { $first: "$image" },
          products: { $push: "$products" },
          categories: { $push: "$categories" },
          createdAt: { $push: "$createdAt" },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          meta: [{ $count: "count" }],
          data: [{ $skip: page * perPage }, { $limit: perPage }],
        },
      },
    ]);

    if (brands[0] && brands[0].meta[0]) {
      brands[0].meta = {
        count: brands[0].meta[0].count,
        lastPage: Math.ceil(brands[0].meta[0].count / perPage),
      };
    }

    res.status(200).json(brands[0]);
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = adminAll;
