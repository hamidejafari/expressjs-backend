const Tag = require("../../models/tag.model");

const adminAllSelect = async (req, res, next) => {
  try {
    const tags = await Tag.find().select("title");

    res.status(200).json(tags);
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = adminAllSelect;
