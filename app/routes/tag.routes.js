const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const tagController = require("../controllers/tag");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");
const Tag = require("../models/tag.model");

router.get("/admin/tags", adminMiddleware, tagController.adminAll);

router.get("/admin/tags-select", adminMiddleware, tagController.adminAllSelect);

router.get("/admin/tags/trash", adminMiddleware, tagController.adminAllTrash);

router.post("/admin/tags/restore/:_id", adminMiddleware, tagController.restore);

router.get("/admin/tags/:_id", tagController.findOne);

router.post(
  "/admin/tags",
  adminMiddleware,
  // imageUpload,
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
  body("title")
    .notEmpty()
    .withMessage("title is required.")
    .custom((value) => {
      return Tag.findOneWithDeleted({ title: value }).then((tag) => {
        if (tag) {
          return Promise.reject("tag already exists.");
        }
      });
    }),
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

      // if (!element.header) {
      //   message[index].header = "header is required.";
      //   localError = true;
      // }

      // if (!element.headerType) {
      //   message[index].headerType = "headerType is required.";
      //   localError = true;
      // }

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
      // else {
      //   message[index].desc = "desc is required.";
      //   localError = true;
      // }

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
  body("slug")
    .notEmpty()
    .withMessage("slug is required.")
    .custom((value) => {
      return Tag.findOneWithDeleted({ slug: value }).then((tag) => {
        if (tag) {
          return Promise.reject("tag already exists.");
        }
      });
    }),
  validationErrorHandlerMiddleware,
  tagController.create
);

router.put(
  "/admin/tags/:_id",
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
  body("title")
    .notEmpty()
    .withMessage("title is required.")
    .custom((value, { req }) => {
      return Tag.findOneWithDeleted({
        title: value,
        _id: { $ne: req.params._id },
      }).then((tag) => {
        if (tag) {
          return Promise.reject("tag already exists.");
        }
      });
    }),
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

      // if (!element.header) {
      //   message[index].header = "header is required.";
      //   localError = true;
      // }

      // if (!element.headerType) {
      //   message[index].headerType = "headerType is required.";
      //   localError = true;
      // }

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
      // else {
      //   message[index].desc = "desc is required.";
      //   localError = true;
      // }

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
  tagController.update
);

router.patch(
  "/admin/tags/image-update/:_id",
  adminMiddleware,
  tagController.imageUpdate
);

router.delete("/admin/tags/:_id", adminMiddleware, tagController.remove);

module.exports = router;
