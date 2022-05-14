const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");
const redirectController = require("../controllers/redirect");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");

router.get("/admin/redirects", adminMiddleware, redirectController.adminAll);

router.get("/admin/redirects/:_id", redirectController.findOne);

router.post(
  "/admin/redirects",
  adminMiddleware,
  body("newAddress").notEmpty().withMessage("new address is required."),
  body("oldAddress").notEmpty().withMessage("old address is required."),
  body("status").notEmpty().withMessage("status is required."),
  validationErrorHandlerMiddleware,
  redirectController.create
);

router.put(
  "/admin/redirects/:_id",
  adminMiddleware,
  body("newAddress").notEmpty().withMessage("new address is required."),
  body("oldAddress").notEmpty().withMessage("old address is required."),
  body("status").notEmpty().withMessage("status is required."),
  validationErrorHandlerMiddleware,
  redirectController.update
);

router.delete("/admin/redirects/:_id", adminMiddleware, redirectController.remove);

module.exports = router;
