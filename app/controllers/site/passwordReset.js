const bcrypt = require("bcrypt");

const create = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    req.user.password = hashPassword;
    await req.user.save();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = create;
