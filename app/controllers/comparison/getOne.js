const Comparison = require("../../models/comparison.model");

const getOne = async (req, res, next) => {
  try {
    const comparison = await Comparison.findById(req.params._id)
      .populate("compare1Id")
      .populate("compare2Id");

    res.status(200).json(comparison);
  } catch (err) {
    next(err);
  }
};

module.exports = getOne;
