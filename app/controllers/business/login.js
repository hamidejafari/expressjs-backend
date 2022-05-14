const User = require("../../models/user.model");

const login = async (req, res, next) => {
  try {
    let user;
    let token;

    user = await User.findOne({ email: req.body.email });

    if (req.body.code === user.confirmCode) {
      token = user.generateToken();
    } else {
      res
        .status(400)
        .json({ error: { code: ["Confirm code is not correct."] } });
    }

    res.status(200).json({ status: "success", token: token });
  } catch (err) {
    next(err);
  }
};

module.exports = login;
