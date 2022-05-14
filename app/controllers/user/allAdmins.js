const User = require("../../models/user.model");

const all = async (req, res, next) => {
  try {
    const users = await User.find({ role: "admin" })
      .sort("-createdAt")
      .populate("permissions");

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
