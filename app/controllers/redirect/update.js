const Redirect = require("../../models/redirect.model");
const LogService = require("../../services/log.service");

const update = async (req, res, next) => {
  try {
    const redirect = await Redirect.findById(req.params._id);

    redirect.newAddress = req.body.newAddress;
    redirect.oldAddress = req.body.oldAddress;
    redirect.status = req.body.status;

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

module.exports = update;
