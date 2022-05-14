const User = require("../../models/user.model");

const getOneAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id).populate("permissions");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = getOneAdmin;
