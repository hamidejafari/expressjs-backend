const Brand = require("../../models/brand.model");

const all = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ _id: req.params._id }).populate(
      "categories._id"
    );
    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
