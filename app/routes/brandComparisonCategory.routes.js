const express = require("express"),
  router = express.Router();

const brandComparisonCategoryController = require("../controllers/brandComparisonCategory");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");

router.get(
  "/admin/brandComparisonCategories",
  adminMiddleware,
  brandComparisonCategoryController.adminAll
);

router.get(
  "/admin/brandComparisonCategories/:_id",
  adminMiddleware,
  brandComparisonCategoryController.findOne
);

router.get(
  "/admin/brandComparisonCategories-all-select",
  adminMiddleware,
  brandComparisonCategoryController.adminAllSelect
);

router.get(
  "/admin/brandComparisonCategories/vs/:_id/brands",
  adminMiddleware,
  brandComparisonCategoryController.categoryVsBrand
);

router.post(
  "/admin/brandComparisonCategories",
  adminMiddleware,
  validationErrorHandlerMiddleware,
  brandComparisonCategoryController.create
);

router.patch(
  "/admin/brandComparisonCategories/:_id/attributes",
  adminMiddleware,
  validationErrorHandlerMiddleware,
  brandComparisonCategoryController.categoryAttributes
);

module.exports = router;
