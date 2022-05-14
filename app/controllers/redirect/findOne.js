const Redirect = require("../../models/redirect.model");

const all = async (req, res, next) => {
  try {
    const redirect = await Redirect.findOne({ _id: req.params._id });
    res.status(200).json(redirect);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
