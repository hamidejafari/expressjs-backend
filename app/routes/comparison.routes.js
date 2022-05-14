const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const comparisonController = require("../controllers/comparison");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");
const categoryAccessMiddleware = require("../middleware/categoryAccess");

router.post(
  "/admin/comparisons",
  adminMiddleware,
  categoryAccessMiddleware,
  comparisonController.create
);

router.put(
  "/admin/comparisons/:_id",
  adminMiddleware,
  categoryAccessMiddleware,
  body("titleSeo").notEmpty().withMessage("titleSeo is required."),
  // body("descriptionSeo").notEmpty().withMessage("descriptionSeo is required."),
  body("winner").notEmpty().withMessage("winner is required."),
  validationErrorHandlerMiddleware,
  comparisonController.update
);

router.get(
  "/admin/comparisons/:_id",
  adminMiddleware,
  categoryAccessMiddleware,
  comparisonController.getOne
);

router.get(
  "/admin/comparisons",
  adminMiddleware,
  comparisonController.adminAll
);

router.get(
  "/admin/comparisons-grouped",
  adminMiddleware,
  comparisonController.adminAllGrouped
);
router.get(
  "/admin/comparisons/brand/grouped",
  adminMiddleware,
  comparisonController.adminAllBrandGrouped
);

module.exports = router;
