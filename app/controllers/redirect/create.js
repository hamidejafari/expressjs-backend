const Redirect = require("../../models/redirect.model");
const LogService = require("../../services/log.service");

const create = async (req, res, next) => {
  try {
    const redirect = new Redirect({
      newAddress: req.body.newAddress,
      oldAddress: req.body.oldAddress,
      status: req.body.status,
    });

    await redirect.save();

    await LogService.create({
      model: "redirect",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: redirect._id,
      userId: req.user._id,
    });

    res.status(200).json(redirect);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
