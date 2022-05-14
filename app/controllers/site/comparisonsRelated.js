const Brand = require("../../models/brand.model");
const Comparison = require("../../models/comparison.model");

const comparisonsGrouped = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug }).select("title");
    const comparisons = await Comparison.find({
      $or: [{ compare1Id: brand._id }, { compare2Id: brand._id }],
    })
      .populate("compare1Id", "title image slug")
      .populate("compare2Id", "title image slug");

    res.status(200).json({comparisons,brand});
  } catch (err) {
    next(err);
  }
};

module.exports = comparisonsGrouped;
