const Category = require("../../models/category.model");
const LogService = require("../../services/log.service");

const create = async (req, res, next) => {
  try {
    const category = new Category({
      title: req.body.title,
      type: "comparison",
      slug: req.body.slug,
    });

    await category.save();

    await LogService.create({
      model: "category",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: category._id,
      userId: req.user._id,
    });

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
