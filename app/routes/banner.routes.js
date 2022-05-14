const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const bannerController = require("../controllers/banner");
const adminMiddleware = require("../middleware/admin");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const Banner = require("../models/banner.model");
router.get("/admin/banners", adminMiddleware, bannerController.adminAll);

router.get("/admin/banners/:_id", adminMiddleware, bannerController.findOne);

router.get(
  "/admin/banners/trash",
  adminMiddleware,
  bannerController.adminAllTrash
);

router.post(
  "/admin/banners",
  adminMiddleware,
  body("modelId")
    .notEmpty()
    .withMessage("model id is required.")
    .custom(async (value) => {
      const banner = await Banner.findOne({ modelId: value });

      if (banner) {
        throw "banner already exists for this model.";
      }
    }),
  body("url").notEmpty().withMessage("url is required."),
  validationErrorHandlerMiddleware,
  bannerController.create
);

router.put(
  "/admin/banners/:_id",
  adminMiddleware,
  body("url").notEmpty().withMessage("url is required."),
  validationErrorHandlerMiddleware,
  bannerController.update
);

router.delete("/admin/banners/:_id", adminMiddleware, bannerController.remove);

module.exports = router;
