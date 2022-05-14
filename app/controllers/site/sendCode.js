const nodemailer = require("nodemailer");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const mail_template = require("../../helpers/mail_template");

const sendCode = async (req, res, next) => {
    try {
        let user;
        let code;
        user = await User.findOne({email:req.body.email});
        code = Math.floor(100000 + Math.random() * 900000).toString();
    
        const hashCode = await bcrypt.hash(code, 10);

        user.confirmCode = hashCode;
        await user.save();

        var transporter = nodemailer.createTransport({
            host: "giowm1158.siteground.biz",
            port: 465,
            secure: true, // true for 465, false for other ports
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

        res.status(200).json({status:'success',code:code});

    } catch (err) {
        // throw(err);
        next(err)
    }
};

module.exports = sendCode;