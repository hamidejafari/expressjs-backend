const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const LogService = require("../../services/log.service");

const createAdmin = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const roleIds = [];
    req.body.roles.forEach((element) => {
      roleIds.push(element._id);
    });

    const user = new User({
      name: req.body.name,
      family: req.body.family,
      phoneNumber: req.body.phoneNumber,
      password: hashPassword,
      role: "admin",
      permissions: roleIds,
    });

    await user.save();

    await LogService.create({
      model: "user",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: user._id,
      userId: req.user._id,
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = createAdmin;
