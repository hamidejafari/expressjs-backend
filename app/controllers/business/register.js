const nodemailer = require("nodemailer");
const User = require("../../models/user.model");
const mail_template = require("../../helpers/mail_template");

const register = async (req, res, next) => {
  try {
    let user;
    let code;
    user = await User.findOne({ email: req.body.email });
    code = Math.floor(100000 + Math.random() * 900000).toString();
    // code = "123456";

    if (!user) {
      user = new User({
        companyName: req.body.companyName,
        phoneNumber: req.body.phoneNumber,
        name: req.body.name,
        family: req.body.family,
        website: req.body.website,
        email: req.body.email,
        confirmCode: code,
        role: "business",
      });
      await user.save();
    } else {
      return res
        .status(400)
        .json({ error: { info: ["you already registered, try to login!"] } });
    }

    var transporter = nodemailer.createTransport({
        host: "giowm1158.siteground.biz",
        port: 465,
        secure: true,
        auth: {
          user: 'info@brandsreviews.com',
          pass: 'fat2022@email'
        }
    });

    var mailOptions = {
        from: 'info@brandsreviews.com',
        to: req.body.email,
        subject: 'Brandsreviws confirm',
        text: "",
        html: mail_template(user.name,code)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ status: "success" });
  } catch (err) {
    next(err);
  }
};

module.exports = register;
