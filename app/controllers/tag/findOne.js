const Tag = require("../../models/tag.model");

const all = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({ _id: req.params._id }).populate(
      "categoryId"
    );

    res.status(200).json(tag);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
