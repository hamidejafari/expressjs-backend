const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");
const blogController = require("../controllers/blog");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");

router.get("/admin/blogs", adminMiddleware, blogController.adminAll);

router.get("/admin/blogs/trash", adminMiddleware, blogController.adminAllTrash);

router.post(
  "/admin/blogs/restore/:_id",
  adminMiddleware,
  blogController.restore
);

router.get("/admin/blogs/:_id", blogController.findOne);

router.post(
  "/admin/blogs",
  adminMiddleware,
  (req, _, next) => {
    if (req.body.description) {
      req.body.description = JSON.parse(req.body.description);
      req.body.description = req.body.description.filter((de) => {
        if (
          de &&
          !(de.headerType === "" || de.header === "" || de.desc === "")
        ) {
          return de;
        }
      });
    }
    next();
  },
  body("title").notEmpty().withMessage("title is required."),
  body("titleSeo").notEmpty().withMessage("title seo is required."),
  body("descriptionSeo").notEmpty().withMessage("description seo is required."),
  body("slug").notEmpty().withMessage("slug is required."),
  body("blogCategoryId").notEmpty().withMessage("blog category is required."),
  body("categoryId").notEmpty().withMessage("category is required."),
  body("description").custom((value) => {
    if (!Array.isArray(value)) {
      throw "description is not Array.";
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;
      if (element.desc) {
        const replacedDesc = element.desc.replaceAll(
          /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
          ""
        );
        if (new RegExp("<[^>]*>").test(replacedDesc)) {
          message[index].desc = "desc is not allowed.";
          localError = true;
        }
      }
      if (localError) {
        hasError = true;
      } else {
        message[index] = null;
      }
    });

    if (hasError) {
      throw message;
    } else {
      return true;
    }
  }),
  validationErrorHandlerMiddleware,
  blogController.create
);

router.put(
  "/admin/blogs/:_id",
  adminMiddleware,
  (req, _, next) => {
    if (req.body.description) {
      req.body.description = JSON.parse(req.body.description);
      req.body.description = req.body.description.filter((de) => {
        if (
          de &&
          !(de.headerType === "" || de.header === "" || de.desc === "")
        ) {
          return de;
        }
      });
    }
    next();
  },
  body("title").notEmpty().withMessage("title is required."),
  body("titleSeo").notEmpty().withMessage("title seo is required."),
  body("descriptionSeo").notEmpty().withMessage("description seo is required."),
  body("slug").notEmpty().withMessage("slug is required."),
  body("blogCategoryId").notEmpty().withMessage("blog category is required."),
  body("categoryId").notEmpty().withMessage("category is required."),
  body("description").custom((value) => {
    if (!Array.isArray(value)) {
      throw "description is not Array.";
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;
      if (element.desc) {
        const replacedDesc = element.desc.replaceAll(
          /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
          ""
        );
        if (new RegExp("<[^>]*>").test(replacedDesc)) {
          message[index].desc = "desc is not allowed.";
          localError = true;
        }
      }
      if (localError) {
        hasError = true;
      } else {
        message[index] = null;
      }
    });

    if (hasError) {
      throw message;
    } else {
      return true;
    }
  }),
  validationErrorHandlerMiddleware,
  blogController.update
);

router.delete("/admin/blogs/:_id", adminMiddleware, blogController.remove);

module.exports = router;
