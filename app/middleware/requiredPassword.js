const bcrypt = require("bcrypt");
const { decode } = require("js-base64");

const requireConfirmationPassword = async (req, res, next) => {
  try {
    const bcryptResult = await bcrypt.compare(
      decode(req.query.password),
      req.user.confirmationPassword
    );

    if (!bcryptResult) {
      const error = new Error();
      error.code = 400;
      error.error = {
        confirmationPassword: ["confirmation password is incorrect."],
      };
      throw error;
    }
  } catch (err) {
    return next(err);
  }
  return next();
};

module.exports = requireConfirmationPassword;
