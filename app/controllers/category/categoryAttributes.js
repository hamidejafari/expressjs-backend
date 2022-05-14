const Category = require("../../models/category.model");
const LogService = require("../../services/log.service");

const categoryAttributes = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params._id);

    if (!category || category.level !== 3) {
      const error = new Error();
      error.code = 404;
      error.message = "404 not found;";
      throw error;
    }

    category.attributes = req.body.attributeSortObject;
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

module.exports = categoryAttributes;
