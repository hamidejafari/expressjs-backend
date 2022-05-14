const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");
const couponController = require("../controllers/coupon");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");

router.get("/admin/coupons", adminMiddleware, couponController.adminAll);

router.get(
  "/admin/coupons/trash",
  adminMiddleware,
  couponController.adminAllTrash
);

router.post(
  "/admin/coupons/restore/:_id",
  adminMiddleware,
  couponController.restore
);

router.get("/admin/coupons/:_id", couponController.findOne);

router.post(
  "/admin/coupons",
  adminMiddleware,
  body("title").notEmpty().withMessage("title is required."),
  body("occasion").notEmpty().withMessage("occasion is required."),
  body("productId").notEmpty().withMessage("productId is required."),
  body("expireDate").notEmpty().withMessage("expireDate is required."),
  body("code").notEmpty().withMessage("code is required."),
  validationErrorHandlerMiddleware,
  couponController.create
);

router.put(
  "/admin/coupons/:_id",
  adminMiddleware,
  body("title").notEmpty().withMessage("title is required."),
  body("occasion").notEmpty().withMessage("occasion is required."),
  body("expireDate").notEmpty().withMessage("expireDate is required."),
  body("code").notEmpty().withMessage("code is required."),
  validationErrorHandlerMiddleware,
  couponController.update
);

router.delete("/admin/coupons/:_id", adminMiddleware, couponController.remove);

module.exports = router;
