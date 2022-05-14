const nodemailer = require("nodemailer");
const User = require("../../models/user.model");
const mail_template = require("../../helpers/mail_template");

const loginSendCode = async (req, res, next) => {
  try {
    let user;
    let code;
    user = await User.findOne({ email: req.body.email });
    code = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
      user = new User({ email: req.body.email });
    }
    user.confirmCode = code;
    await user.save();

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
      html: mail_template("", code),
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ status: "success" });
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = loginSendCode;
