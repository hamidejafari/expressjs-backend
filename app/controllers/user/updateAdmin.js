const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const LogService = require("../../services/log.service");

const updateAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);

    if (!user) {
      const error = new Error();
      error.code = 404;
      error.message = "404 not found;";
      throw error;
    }

    user.name = req.body.name;
    user.family = req.body.family;
    user.phoneNumber = req.body.phoneNumber;
    user.permissions = JSON.parse(req.body.permissions);

    if (req.body.password) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);

      user.password = hashPassword;
    }

    if (req.body.confirmationPassword) {
      const hashconfirmationPassword = await bcrypt.hash(
        req.body.confirmationPassword,
        10
      );

      user.confirmationPassword = hashconfirmationPassword;
    }

    await LogService.create({
      model: "user",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: user._id,
      userId: req.user._id,
    });

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = updateAdmin;
