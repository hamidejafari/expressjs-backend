const Log = require("../../models/log.model");
const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");
const Blog = require("../../models/blog.model");

const all = async (req, res, next) => {
  const perPage = +req.query.perPage || 100;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};

    if (req.query.startDate) {
      if (req.query.endDate) {
        query.createdAt = {
          $gte: new Date(+req.query.startDate).toISOString(),
          $lt: new Date(+req.query.endDate).toISOString(),
        };
      } else {
        query.createdAt = {
          $gte: new Date(+req.query.startDate).toISOString(),
        };
      }
    }

    if (req.query.adminIds) {
      req.query.adminIds = req.query.adminIds.split(",");
      query.userId = { $in: req.query.adminIds };
    }

    if (req.query.model) {
      query.model = req.query.model;
    }

    if (req.query.title) {
      const categories = await Category.find({
        title: { $regex: req.query.title.trim(), $options: "i" },
      }).select("_id");
      const products = await Product.find({
        title: { $regex: req.query.title.trim(), $options: "i" },
      }).select("_id");
      const brands = await Brand.find({
        title: { $regex: req.query.title.trim(), $options: "i" },
      }).select("_id");
      const blogs = await Blog.find({
        title: { $regex: req.query.title.trim(), $options: "i" },
      }).select("_id");
      let ids = [];
      categories.map((item) => {
        ids.push(item._id);
      });
      products.map((item) => {
        ids.push(item._id);
      });
      brands.map((item) => {
        ids.push(item._id);
      });
      blogs.map((item) => {
        ids.push(item._id);
      });
      query.modelId = { $in: ids };
    }

    const logs = await Log.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("modelId")
      .populate("userId");

    const count = await Log.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: logs, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = all;
