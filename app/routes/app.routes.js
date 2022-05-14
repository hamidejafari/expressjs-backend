const express = require("express"),
  router = express.Router();
const appController = require("../controllers/app");
const adminMiddleware = require("../middleware/admin");



router.get(
  "/admin/sidebar-badges",
  adminMiddleware,
  appController.sidebarBadges
);

router.get(
  "/admin/brand-bulk-json",
  adminMiddleware,
  appController.brandBulkJson
);

router.get(
  "/admin/product-bulk-json",
  adminMiddleware,
  appController.productBulkJson
);

router.get(
  "/admin/category-bulk-json",
  adminMiddleware,
  appController.categoryBulkJson
);

router.get(
  "/admin/blog-bulk-json",
  adminMiddleware,
  appController.blogBulkJson
);

router.get("/admin/vs-bulk-json", adminMiddleware, appController.vsBulkJson);

router.get("/search", appController.getElasticSearch);
router.get("/search-category", appController.getElasticSearchCategory);
router.get("/search-comparison", appController.getElasticSearchComparison);

module.exports = router;
