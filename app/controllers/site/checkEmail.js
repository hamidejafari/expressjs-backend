const nodemailer = require("nodemailer");

const User = require("../../models/user.model");
const mail_template = require("../../helpers/mail_template");

const sendCode = (name, email, code) => {
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
    to: email,
    subject: "Brandsreviws confirm",
    text: "",
    html: mail_template(name, code),
  };

  transporter.sendMail(mailOptions);
};

const checkEmail = async (req, res, next) => {
  try {
    let user;

    user = await User.findOne({ email: req.body.email });

    if (!user) {
      let code = Math.floor(100000 + Math.random() * 900000).toString();

      user = new User({ email: req.body.email, confirmCode: code });

      await user.save();

      sendCode("", req.body.email, code);

      return res.status(200).json({ status: "code" });
    } else if (!user.password) {
      let code = Math.floor(100000 + Math.random() * 900000).toString();

      user.confirmCode = code;
      await user.save();

      sendCode(user.name || "", req.body.email, code);

      return res.status(200).json({ status: "code" });
    } else {
      return res.status(200).json({ status: "password" });
    }
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = checkEmail;
