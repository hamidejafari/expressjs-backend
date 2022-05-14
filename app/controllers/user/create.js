const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

const create = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      family: req.body.family,
      phoneNumber: req.body.phoneNumber,
      password: hashPassword,
    });

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
