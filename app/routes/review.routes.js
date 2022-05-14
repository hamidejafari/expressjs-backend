const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");
const reviewController = require("../controllers/review");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");

router.get("/admin/reviews", adminMiddleware, reviewController.adminAll);

router.post(
  "/admin/reviews",
  adminMiddleware,
  body("content").notEmpty().withMessage("content is required."),
  body("name").notEmpty().withMessage("name is required."),
  body("star").notEmpty().withMessage("star is required."),
  body("modelId").notEmpty().withMessage("product/brand is required."),
  validationErrorHandlerMiddleware,
  reviewController.create
);

router.post(
  "/admin/reviews/reply",
  adminMiddleware,
  body("content").notEmpty().withMessage("content is required."),
  body("name").notEmpty().withMessage("name is required."),
  body("name").notEmpty().withMessage("name is required."),
  body("replyTo").notEmpty().withMessage("replyTo is required."),
  validationErrorHandlerMiddleware,
  reviewController.create
);

router.put(
  "/admin/reviews/:_id",
  adminMiddleware,
  body("status").notEmpty().withMessage("status is required."),
  validationErrorHandlerMiddleware,
  reviewController.update
);

router.delete("/admin/reviews/:_id", adminMiddleware, reviewController.remove);

module.exports = router;
