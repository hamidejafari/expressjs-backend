const express = require("express"),
  router = express.Router();

const searchHistoryController = require("../controllers/searchHistory");
const adminMiddleware = require("../middleware/admin");

router.get(
  "/admin/search-history",
  adminMiddleware,
  searchHistoryController.adminAll
);

module.exports = router;
