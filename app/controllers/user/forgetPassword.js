const User = require("../../models/user.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const moment = require("moment");

const forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(400)
        .json({ error: { email: ["email does not exist."] } });
    }

    const code = crypto.randomBytes(20).toString("hex");

    user.passwordReset = {
      code: code,
      expire: moment().add(3, "hours"),
    };
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "giowm1158.siteground.biz",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "info@brandsreviews.com",
        pass: "fat2022@email",
      },
    });

    const mailOptions = {
      from: "info@brandsreviews.com",
      to: req.body.email,
      subject: "reset password link ",
      text: process.env.MAIN_URL + "/auth/reset-password/" + code,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = forgetPassword;
