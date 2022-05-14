const Category = require("../../models/category.model");

const categoryAttributes = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params._id);

    category.attributes = req.body.attributeSortObject;
    await category.save();

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = categoryAttributes;
