const User = require("../../models/user.model");

const check = async (req, res, next) => {
  try {
    const user = await User.findOne({ website: req.params.website });
    if (user) {
      // code = Math.floor(100000 + Math.random() * 900000).toString();
      const code = "123456";
      user.confirmCode = code;
      await user.save();

      // var transporter = nodemailer.createTransport({
      //     host: "giowm1158.siteground.biz",
      //     port: 465,
      //     secure: true,
      //     auth: {
      //       user: 'info@brandsreviews.com',
      //       pass: 'fat2022@email'
      //     }
      // });

      // var mailOptions = {
      //     from: 'info@brandsreviews.com',
      //     to: user.email,
      //     subject: 'Brandsreviws confirm',
      //     text: "",
      //     html: mail_template(user.name,code)
      // };

      // await transporter.sendMail(mailOptions);

      res.status(200).json({ exist: true, email: user.email });
    } else {
      res.status(200).json({ exist: false });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = check;
