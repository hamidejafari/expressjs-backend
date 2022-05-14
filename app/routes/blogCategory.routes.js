const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const blogCategoryController = require("../controllers/blogCategory");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");
const imageUpload = require("../middleware/imageUpload");

router.get(
  "/admin/blog-categories",
  adminMiddleware,
  blogCategoryController.adminAll
);

router.get(
  "/admin/blog-categories/trash",
  adminMiddleware,
  blogCategoryController.adminAllTrash
);

router.post(
  "/admin/blog-categories/restore/:_id",
  adminMiddleware,
  blogCategoryController.restore
);

router.get("/admin/blog-categories/:_id", blogCategoryController.findOne);

router.post(
  "/admin/blog-categories",
  adminMiddleware,
  imageUpload,
  (req, _, next) => {
    next();
  },
  body("title").notEmpty().withMessage("title is required."),
  body("h1").notEmpty().withMessage("h1 is required."),
  body("categoryId").notEmpty().withMessage("category is required."),
  body("description").custom((value) => {
    if (!value) {
      return true;
    }
    const replacedDesc = value.replaceAll(
      /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
      ""
    );
    if (new RegExp("<[^>]*>").test(replacedDesc)) {
      throw "descriptionShort is not allowed.";
    }
    return true;
  }),
  validationErrorHandlerMiddleware,
  blogCategoryController.create
);

router.put(
  "/admin/blog-categories/:_id",
  adminMiddleware,
  imageUpload,
  (req, _, next) => {
    next();
  },
  body("title").notEmpty().withMessage("title is required."),
  body("h1").notEmpty().withMessage("h1 is required."),
  body("categoryId").notEmpty().withMessage("category is required."),
  body("description").custom((value) => {
    if (!value) {
      return true;
    }
    const replacedDesc = value.replaceAll(
      /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
      ""
    );
    if (new RegExp("<[^>]*>").test(replacedDesc)) {
      throw "descriptionShort is not allowed.";
    }
    return true;
  }),
  validationErrorHandlerMiddleware,
  blogCategoryController.update
);

router.delete(
  "/admin/blog-categories/:_id",
  adminMiddleware,
  blogCategoryController.remove
);

module.exports = router;
