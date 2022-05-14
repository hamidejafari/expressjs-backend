const User = require("../../models/user.model");

const loginConfirmCode = async (req, res, next) => {
  try {
    let user;
    user = await User.findOne({ email: req.body.email });
    const token = user.generateToken();

    if (!user) {
      return res.status(404);
    }
    if (user.confirmCode === req.body.code) {
      return res.status(200).json({ status: "success", token });
    } else {
      return res.status(401).json({ status: "false" });
    }
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = loginConfirmCode;
