const express = require("express"),
  router = express.Router();
const siteController = require("../controllers/site");
const { body } = require("express-validator");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const Redirect = require("../models/redirect.model");
const userMiddleware = require("../middleware/user");
const authMiddleware = require("../middleware/auth");
const axios = require("axios");
const bcrypt = require("bcrypt");

router.get("/site/test-pass", async (_, res) => {
  const hashPassword = await bcrypt.hash("**hamideh**", 10);
res.status(200).json(hashPassword);

});

router.get("/site/test-bot", async (_, res) => {
  const msg =
    "New 1 star review alert \n" +
    "from : hamide jafari \n" +
    "review : it was bad \n" +
    "for : cureganics \n";

  var config = {
    method: "get",
    url:
      "https://api.telegram.org/bot5280227905:AAHTJMRXrl6eg9HRXPiROqWOdtukt8ep4Pc/sendMessage?chat_id=5220000118&text=" +
      msg +
      "&parse_mode=html",
    headers: {},
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

  res.status(200).json("success");
});

router.get("/site/more-reivews", siteController.moreReviews);

router.get("/site/tags/:slug", siteController.oneTag);

router.get("/site/first-page", siteController.firstPage);
router.post("/site/search", userMiddleware, siteController.search);
router.get("/site/blog-search", siteController.blogSearch);

router.get("/site/menu-categories", siteController.menuCategories);

router.get("/site/layout-data", siteController.layoutData);

router.get("/site/category/:_id", siteController.categoryDetail);

router.get(
  "/site/product/:catSlug/:proSlug",
  userMiddleware,
  siteController.productDetail
);

router.get("/site/brand/:slug", userMiddleware, siteController.brandDetail);

router.post(
  "/site/get-code",
  body("email").isEmail().withMessage("email is not valid."),
  body("name").notEmpty().withMessage("name is required."),
  body("content").notEmpty().withMessage("content is required."),
  body("onModel").notEmpty().withMessage("model is required."),
  body("modelId").notEmpty().withMessage("model id is required."),
  // body("star").notEmpty().withMessage("star is required."),
  body("star").custom((value, { req }) => {
    if (req.body?.onModel !== "blog" && !req.body?.star) {
      throw "star is required.";
    }
    return true;
  }),
  body("content").custom((value) => {
    if (new RegExp("<[^>]*>").test(value)) {
      throw "content is not allowed.";
    }
    return true;
  }),
  validationErrorHandlerMiddleware,
  siteController.getCode
);

router.post(
  "/site/reply/get-code",
  (req, _, next) => {
    req.isReply = true;
    next();
  },
  body("email").isEmail().withMessage("email is not valid."),
  body("name").notEmpty().withMessage("name is required."),
  body("content").notEmpty().withMessage("content is required."),
  body("content").custom((value) => {
    if (new RegExp("<[^>]*>").test(value)) {
      throw "content is not allowed.";
    }
    return true;
  }),
  validationErrorHandlerMiddleware,
  siteController.getCode
);

router.post(
  "/site/store-review",
  body("email").isEmail().withMessage("email is not valid."),
  // body("name").notEmpty().withMessage("name is required."),
  body("content").notEmpty().withMessage("review content is required."),
  body("onModel").notEmpty().withMessage("model is required."),
  // body("star").notEmpty().withMessage("star is required."),
  body("star").custom((value, { req }) => {
    if (req.body?.onModel !== "blog" && !value) {
      throw "star is required.";
    }
    return true;
  }),
  body("modelId").notEmpty().withMessage("model id is required."),
  body("content").custom((value) => {
    if (new RegExp("<[^>]*>").test(value)) {
      throw "content is not allowed.";
    }
    return true;
  }),
  validationErrorHandlerMiddleware,
  siteController.storeReview
);

router.post(
  "/site/store-reply",
  body("email").isEmail().withMessage("email is not valid."),
  body("replyTo").notEmpty().withMessage("replyTo is required."),
  // body("name").notEmpty().withMessage("name is required."),
  body("content")
    .notEmpty()
    .withMessage("review content is required.")
    .custom((value) => {
      if (new RegExp("<[^>]*>").test(value)) {
        throw "content is not allowed.";
      }
      return true;
    }),
  validationErrorHandlerMiddleware,
  siteController.storeReview
);

router.post(
  "/site/contact",
  body("firstName").notEmpty().withMessage("first name is required."),
  body("lastName").notEmpty().withMessage("last name is required."),
  body("email").isEmail().withMessage("email is not valid."),
  body("messageText").notEmpty().withMessage("message text is required."),
  body("messageText").custom((value) => {
    if (new RegExp("<[^>]*>").test(value)) {
      throw "message is not allowed.";
    }
    return true;
  }),
  validationErrorHandlerMiddleware,
  siteController.storeContact
);

router.get("/user-details", authMiddleware, siteController.userDetails);

router.post(
  "/site/password-reset",

  authMiddleware,
  body("password").notEmpty().withMessage("password is required."),
  validationErrorHandlerMiddleware,

  siteController.passwordReset
);

router.delete(
  "/site/reviews/:_id",
  authMiddleware,
  siteController.reviewRemove
);

router.get("/site/brands", siteController.brands);

router.get("/site/maincat", siteController.maincat);
router.get("/site/maincat/search", siteController.maincatSearch);

router.get("/site/blog-category/list", siteController.blogCategoryList);

// router.get("/site/blog-category/:slug", siteController.blogCategoryDetail);
// router.get("/site/blog/:slug", siteController.blogDetail);

router.get("/site/blog/:slug", siteController.blogDetail);

router.post(
  "/site/comparisons-grouped",
  userMiddleware,
  siteController.comparisonsGrouped
);
router.get(
  "/site/comparisons/related/:slug",
  siteController.comparisonsRelated
);
router.get("/site/comparisons/:slug", siteController.getOneComparisons);

router.post(
  "/site/register",
  body("email").isEmail().withMessage("email is not valid."),
  body("name").notEmpty().withMessage("name is required."),
  body("password").notEmpty().withMessage("password is required."),
  body("rePassword").notEmpty().withMessage("re-password is required."),
  validationErrorHandlerMiddleware,
  siteController.register
);

router.post(
  "/site/confirm",
  body("email").isEmail().withMessage("email is not valid."),
  body("code").notEmpty().withMessage("code is required."),
  validationErrorHandlerMiddleware,
  siteController.confirm
);

router.post(
  "/site/send-code",
  body("email").isEmail().withMessage("email is not valid."),
  validationErrorHandlerMiddleware,
  siteController.sendCode
);
router.post(
  "/site/login",
  body("email").isEmail().withMessage("email is not valid."),
  body("password").notEmpty().withMessage("password is required."),
  validationErrorHandlerMiddleware,
  siteController.login
);

router.post(
  "/site/user/check-email",
  body("email").isEmail().withMessage("email is not valid."),
  validationErrorHandlerMiddleware,
  siteController.checkEmail
);

router.post(
  "/site/user/confirm-password",
  body("password").notEmpty().withMessage("password is required."),
  validationErrorHandlerMiddleware,
  siteController.confirmPassword
);

router.get("/all-redirects", async (_, res) => {
  const redirects = await Redirect.find({ type: "image" });
  res.status(200).json({ redirects: redirects });
});

router.post("/site/coupon-brands", siteController.couponBrands);

router.post("/site/login/send-code", siteController.loginSendCode);
router.post("/site/login/confirm-code", siteController.loginConfirmCode);

router.get("/site/coupon-brand/:slug", siteController.getOneBrandCoupon);
router.get(
  "/site/product-coupon/:categorySlug/:brandSlig",
  siteController.getOneProductCoupon
);

module.exports = router;
