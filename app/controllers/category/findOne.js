const Category = require("../../models/category.model");

const all = async (req, res, next) => {
  try {
    if (!req.categoryIds.includes(req.params._id)) {
      const error = new Error();
      error.code = 403;
      error.message = "403 Forbidden.";
      throw error;
    }

    const categories = await Category.findOne({ _id: req.params._id })
      .populate("parentId")
      .populate("brands._id")
      .populate("draftBrands._id")
      .populate("draftProducts._id")
      .populate("products._id");
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = all;