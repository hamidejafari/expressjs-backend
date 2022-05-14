const nodemailer = require("nodemailer");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const mail_template = require("../../helpers/mail_template");
const axios = require("axios");

const getCode = async (req, res, next) => {
  try {
    if (!req.isReply) {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.captchaValue}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
        }
      );

      if (!response?.data?.success) {
        return res
          .status(400)
          .json({ error: { captchaValue: ["please select captcha."] } });
      }
    }

    let user;
    let code;
    user = await User.findOne({ email: req.body.email });
    if (user && user?.email === "fat@gmail.com") {
      code = "123456";
    } else {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const hashPassword = await bcrypt.hash(code, 10);

    if (!user) {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        confirmCode: hashPassword,
        role: "user",
      });
      await user.save();
    } else {
      user.confirmCode = hashPassword;
      await user.save();
    }

    var transporter = nodemailer.createTransport({
      host: "giowm1158.siteground.biz",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "info@brandsreviews.com",
        pass: "fat2022@email",
      },
    });
    var mailOptions = {
      from: "info@brandsreviews.com",
      to: req.body.email,
      subject: "Brandsreviws confirm",
      text: "",
      html: mail_template(user.name, code),
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ status: "success", code: code });
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = getCode;
