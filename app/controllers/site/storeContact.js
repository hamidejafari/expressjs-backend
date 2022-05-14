const Contact = require("../../models/contact.model");
const nodemailer = require("nodemailer");
const axios = require("axios");
// var FormData = require("form-data");

const storeContact = async (req, res, next) => {
  try {
    // const formData = new FormData();
    // formData.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    // formData.append("response", req.body.captchaValue);

    // const response = await axios.post(
    //   "https://www.google.com/recaptcha/api/siteverify",
    //   formData
    // );

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

    const contact = new Contact({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      title: req.body.title,
      messageText: req.body.messageText,
    });

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
      to: "hello@brandsreviews.com",
      subject:
        "New Contact Us Message from " +
        contact.firstName +
        " " +
        contact.lastName,
      text: contact.messageText,
    };
    await transporter.sendMail(mailOptions);

    await contact.save();
    res
      .status(200)
      .json({ status: "success", message: "submited successfully." });
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = storeContact;
