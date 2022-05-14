const express = require("express"),
  router = express.Router();

const logController = require("../controllers/log");
const adminMiddleware = require("../middleware/admin");
const requireConfirmationPassword = require("../middleware/requiredPassword");

router.get(
  "/admin/logs",
  adminMiddleware,
  requireConfirmationPassword,
  logController.all
);

module.exports = router;
