const bcrypt = require("bcrypt");

const User = require("../../models/user.model");

const login = async (req, res, next) => {
  try {
    let user;
    // if (req.body.username.match(/^09[0-9]{9}$/)) {
    user = await User.findOne({ phoneNumber: req.body.username });
    // } else {
    // user = await User.findOne({ username: req.body.username });
    // }

    if (!user) {
      const error = new Error();
      error.code = 400;
      error.error = { username: ["username or phone number doesn't exists."] };
      throw error;
    }

    const bcryptResult = await bcrypt.compare(req.body.password, user.password);

    if (bcryptResult) {
      const token = user.generateToken();
      return res.send({ token: token });
    } else {
      const error = new Error();
      error.code = 400;
      error.error = { password: ["password is incorrect."] };
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = login;
