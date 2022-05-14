const Banner = require("../../models/banner.model");

const all = async (req, res, next) => {
  try {
    const banner = await Banner.findOne({ _id: req.params._id })
      .populate("modelId")
      .populate("productExceptions" , "title")
      .populate("brandExceptions" , "title");

    res.status(200).json(banner);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
