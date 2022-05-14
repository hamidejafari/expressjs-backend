const Redirect = require("../../models/redirect.model");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const redirect = await Redirect.findById(req.params._id);


    await LogService.create({
      model: "redirect",
      url: req.originalUrl,
      method: req.method,
      data: redirect,
      modelId: redirect._id,
      userId: req.user._id,
    });

    await redirect.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
