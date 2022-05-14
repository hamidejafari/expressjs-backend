const User = require("../../models/user.model");
const Review = require("../../models/review.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require('axios');

const storeReview = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    let user;

    if (!token) {
      user = await User.findOne({ email: req.body.email });
      const bcryptResult = await bcrypt.compare(
        req.body.code,
        user.confirmCode
      );
      if (bcryptResult) {
        token = user.generateToken();
      } else {
        res
          .status(200)
          .json({ status: "fail", message: "Code is not correct" });
      }
    } else {
      let decoded;
      try {
        decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
      } catch (err) {
        res.status(200).json({ status: "fail", message: "Not authorized" });
      }
      user = await User.findById(decoded?.user_id);

      if (!user?.name) {
        user.name = req.body?.name;
        await user.save();
      }
    }

    if (user) {
      const review = new Review({
        title: req.body.title,
        content: req.body.content,
        name: req.body.email === "fat@gmail.com" ? req.body?.name : user?.name,
        email: req.body.email,
        userId: user._id,
        star: req.body?.star,
        onModel: req.body.onModel,
        modelId: req.body.modelId,
      });

      if (req.body.replyTo) {
        const parent = await Review.findById(req.body.replyTo);

        review.parentId = req.body.replyTo;
        review.depth = +parent.depth + 1;
        review.onModel = parent.onModel;
        review.modelId = parent.modelId;
      }
      await review.save();

      if(review.star < 5){
        const reviewFound = await Review.findById(review._id)
        .populate("modelId");
        const telMessage = "New review alert \n\n"+"from : "+user.name+"\n\n"+"for : "+reviewFound?.modelId?.title +"\n\n"+review.star+ "star" + " \n\n submit date : "+ review.createdAt
        var config = {
          method: 'get',
          url: 'https://api.telegram.org/bot5280227905:AAHTJMRXrl6eg9HRXPiROqWOdtukt8ep4Pc/sendMessage?chat_id=5233623236&text='+telMessage+'&parse_mode=html',
          headers: {}
        };
        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(config.url);
          console.log(error);
        });
      }

      res.status(200).json({
        status: "success",
        message: "Review submited successfully.",
        token: token,
      });
    } else {
      res.status(200).json({ status: "fail", message: "Not authorized" });
    }

  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = storeReview;
