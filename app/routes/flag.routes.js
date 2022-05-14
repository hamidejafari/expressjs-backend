const express = require("express"),
  router = express.Router();

const flagController = require("../controllers/flag");
const adminMiddleware = require("../middleware/admin");

router.get("/admin/flags", adminMiddleware, flagController.adminAll);

module.exports = router;