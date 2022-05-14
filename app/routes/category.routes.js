const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const categoryController = require("../controllers/category");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");
const categoryAccessMiddleware = require("../middleware/categoryAccess");
// const iconUpload = require("../middleware/iconUpload");
const Category = require("../models/category.model");
const capitalize_first_letter = require("../helpers/capitalize_first_letter");
const string_to_slug = require("../helpers/string_to_slug");

// router.get("/fix-categories", async (_, res) => {
//   // db.getSiblingDB("dbtest").colltest4.update({}, [{ $set: {result : { $switch: {branches: [{ case: { $gte: [ "$grade", 7 ] }, then: "PASSED" }, { case: { $lte: [ "$grade", 5 ] }, then: "NOPE" }, { case: { $eq: [ "$grade", 6 ] }, then: "UNDER ANALYSIS" } ] } } } } ],{multi:true} )

//   // const category2 = await Category.update({},[{ $set: }]);

//   await Category.updateMany({ level: 3 }, { products: [] });

//   // console.log(category2);
//   res.send("fix categories");
// });

router.get(
  "/admin/categories",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.adminAll
);

router.get(
  "/admin/categories/trash",
  adminMiddleware,
  categoryController.adminAllTrash
);

router.get(
  "/admin/categories/all-select",
  adminMiddleware,
  categoryController.adminAllSelect
);

router.get(
  "/admin/best-categories",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.adminBestAll
);

router.get(
  "/admin/categories/less-5-product-rate",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.lessFiveProductRate
);

router.get(
  "/admin/category-parents",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.adminGetAllParent
);

router.get(
  "/admin/category-level-three",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.adminGetLevelThree
);

router.get(
  "/admin/category-level-two",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.adminGetLevelTwo
);

router.get(
  "/admin/category-level-one",
  adminMiddleware,
  categoryController.adminGetLevelOne
);

router.get(
  "/admin/category-level-one-and-two",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.adminGetLevelOneAndTwo
);

router.get(
  "/admin/category-level-one-and-two-select",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.adminGetLevelOneAndTwoSelect
);

router.get(
  "/admin/categories/:_id",
  adminMiddleware,
  categoryAccessMiddleware,
  categoryController.findOne
);

router.get(
  "/admin/categories/vs/:_id/products",
  adminMiddleware,
  categoryController.categoryVsProducts
);

router.post(
  "/admin/category-sort-brand",
  adminMiddleware,
  categoryAccessMiddleware,
  (req, _, next) => {
    if (!req.categoryIds.includes(req.body.categoryId)) {
      const error = new Error();
      error.code = 403;
      error.message = "403 Forbidden.";
      throw error;
    }

    if (req.body.sortObject) {
      req.body.sortObject = JSON.parse(req.body.sortObject);
    }
    next();
  },
  validationErrorHandlerMiddleware,
  categoryController.sortBrand
);

router.post(
  "/admin/category-sort-product",
  adminMiddleware,
  categoryAccessMiddleware,
  (req, _, next) => {
    if (!req.categoryIds.includes(req.body.categoryId)) {
      const error = new Error();
      error.code = 403;
      error.message = "403 Forbidden.";
      throw error;
    }

    if (req.body.sortObject) {
      req.body.sortObject = JSON.parse(req.body.sortObject);
    }
    next();
  },
  validationErrorHandlerMiddleware,
  categoryController.sortProduct
);

router.patch(
  "/admin/categories/:_id/attributes",
  adminMiddleware,
  categoryAccessMiddleware,
  (req, _, next) => {
    if (!req.categoryIds.includes(req.params._id)) {
      const error = new Error();
      error.code = 403;
      error.message = "403 Forbidden.";
      throw error;
    }
    next();
  },
  validationErrorHandlerMiddleware,
  categoryController.categoryAttributes
);

router.post(
  "/admin/categories",
  adminMiddleware,
  categoryAccessMiddleware,
  // iconUpload,
  (req, _, next) => {
    if (req.body.parentId) {
      if (!req.categoryIds.includes(req.body.parentId)) {
        const error = new Error();
        error.code = 403;
        error.message = "403 Forbidden.";
        throw error;
      }
    }
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

    if (req.body.faq) {
      req.body.faq = JSON.parse(req.body.faq);

      req.body.faq = req.body.faq.filter((fa) => {
        if (fa && !(fa.question === "" || fa.answer === "")) {
          return fa;
        }
      });
    }

    if (req.body.title) {
      req.body.title = capitalize_first_letter(req.body.title.trim(), " ");
    }
    if (req.body.slug) {
      req.body.slug = req.body.slugOld
        ? req.body.slug
        : capitalize_first_letter(string_to_slug(req.body.slug.trim()), "-");
    }
    next();
  },
  body("title")
    .notEmpty()
    .withMessage("title is required.")
    .custom((value, { req }) => {
      if (req.body.parentId) {
        return Category.findOneWithDeleted({
          type: "category",
          title: value,
          parentId: req.body.parentId,
        }).then((category) => {
          if (category) {
            return Promise.reject("category already exists.");
          }
        });
      }
      return Category.findOneWithDeleted({
        type: "category",
        title: value,
      }).then((category) => {
        if (category) {
          return Promise.reject("category already exists.");
        }
      });
    }),
  // body("titleSeo").notEmpty().withMessage("title seo is required."),
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
  body("shortDescription").custom((value) => {
    if (!value) {
      return true;
    }
    value = value.replaceAll(/<p>|<\/p>/g, "");

    const replaced = value.replaceAll(
      /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
      ""
    );
    if (new RegExp("<[^>]*>").test(replaced)) {
      throw "shortDescription is not allowed.";
    }
    return true;
  }),
  // body("descriptionSeo").notEmpty().withMessage("description seo is required."),
  // body("icon").notEmpty().withMessage("icon is required."),
  // body("active").notEmpty().withMessage("active is required."),
  // body("showHomePage").notEmpty().withMessage("showHomePage is required."),
  body("faq").custom((value, { req }) => {
    if (!Array.isArray(value)) {
      req.body.faq = [];
      return true;
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;

      if (!element.question) {
        message[index].question = "question is required.";
        localError = true;
      }

      if (!element.answer) {
        message[index].answer = "answer is required.";
        localError = true;
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
  body("slug")
    .notEmpty()
    .withMessage("slug is required.")
    .custom((value) => {
      return Category.findOneWithDeleted({
        type: "category",
        slug: value,
      }).then((category) => {
        if (category) {
          return Promise.reject("slug already exists.");
        }
      });
    }),
  validationErrorHandlerMiddleware,
  categoryController.create
);

router.put(
  "/admin/categories/:_id",
  adminMiddleware,
  categoryAccessMiddleware,
  // iconUpload,
  (req, _, next) => {
    if (!req.categoryIds.includes(req.params._id)) {
      const error = new Error();
      error.code = 403;
      error.message = "403 Forbidden.";
      throw error;
    }
    if (req.body.description) {
      req.body.description = JSON.parse(req.body.description);

      req.body.description = req.body.description.filter((de) => {
        if (
          de &&
          !(de.headerType === "" || de.header === "" || de.desc === "")
        ) {
          de.desc.replace('rel="noopener"', "");
          return de;
        }
      });
    }

    if (req.body.faq) {
      req.body.faq = JSON.parse(req.body.faq);

      req.body.faq = req.body.faq.filter((fa) => {
        if (fa && !(fa.question === "" || fa.answer === "")) {
          return fa;
        }
      });
    }

    if (req.body.title) {
      req.body.title = capitalize_first_letter(req.body.title.trim(), " ");
    }
    if (req.body.slug) {
      req.body.slug = req.body.slugOld
        ? req.body.slug
        : // : capitalize_first_letter(string_to_slug(req.body.slug.trim()), "-");
          req.body.slug;
    }
    next();
  },
  body("title")
    .notEmpty()
    .withMessage("title is required.")
    .custom((value, { req }) => {
      if (req.body.parentId) {
        return Category.findOneWithDeleted({
          type: "category",
          title: value,
          parentId: req.body.parentId,
          _id: { $ne: req.params._id },
        }).then((category) => {
          if (category) {
            return Promise.reject("category already exists.");
          }
        });
      }
      return Category.findOneWithDeleted({
        type: "category",
        title: value,
        _id: { $ne: req.params._id },
      }).then((category) => {
        if (category) {
          return Promise.reject("category already exists.");
        }
      });
    }),
  // body("titleSeo").notEmpty().withMessage("title seo is required."),
  body("faq").custom((value, { req }) => {
    if (!Array.isArray(value)) {
      req.body.faq = [];
      return true;
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;

      if (!element.question) {
        message[index].question = "question is required.";
        localError = true;
      }

      if (!element.answer) {
        message[index].answer = "answer is required.";
        localError = true;
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
  body("shortDescription").custom((value) => {
    if (!value) {
      return true;
    }
    value = value.replaceAll(/<p>|<\/p>/g, "");

    const replaced = value.replaceAll(
      /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
      ""
    );
    if (new RegExp("<[^>]*>").test(replaced)) {
      throw "shortDescription is not allowed.";
    }
    return true;
  }),
  // body("descriptionSeo").notEmpty().withMessage("description seo is required."),
  // body("icon").notEmpty().withMessage("icon is required."),
  // body("active").notEmpty().withMessage("active is required."),
  // body("showHomePage").notEmpty().withMessage("showHomePage is required."),
  validationErrorHandlerMiddleware,
  categoryController.update
);

router.patch(
  "/admin/categories/image-update/:_id",
  adminMiddleware,
  categoryController.imageUpdate
);

router.delete(
  "/admin/categories/:_id",
  adminMiddleware,
  categoryController.remove
);

router.post(
  "/admin/categories/restore/:_id",
  adminMiddleware,
  categoryController.restore
);

router.get("/best-not-rate", categoryController.bestNotRate);

router.get("/category-no-product", categoryController.categoryNoProduct);

module.exports = router;
