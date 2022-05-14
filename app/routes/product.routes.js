const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const productController = require("../controllers/product");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");
// const imageUpload = require("../middleware/imageUpload");
const capitalize_first_letter = require("../helpers/capitalize_first_letter");
const categoryAccessMiddleware = require("../middleware/categoryAccess");
const Product = require("../models/product.model");

router.get(
  "/admin/product-parents",
  adminMiddleware,
  categoryAccessMiddleware,
  productController.parents
);

router.get(
  "/admin/products-all",
  adminMiddleware,
  categoryAccessMiddleware,
  productController.allProducts
);

router.get(
  "/admin/category-products",
  adminMiddleware,
  productController.categoryProducts
);

router.get(
  "/admin/products-select-box",
  adminMiddleware,
  categoryAccessMiddleware,
  productController.adminSelectBox
);

router.get(
  "/admin/products",
  adminMiddleware,
  categoryAccessMiddleware,
  productController.adminAll
);

router.get(
  "/admin/products/trash",
  adminMiddleware,
  categoryAccessMiddleware,
  productController.adminAllTrash
);

router.post(
  "/admin/products/restore/:_id",
  adminMiddleware,
  productController.restore
);

router.get(
  "/admin/products/:_id",
  adminMiddleware,
  categoryAccessMiddleware,
  productController.findOne
);

router.post(
  "/admin/products",
  adminMiddleware,
  body("categoryId").notEmpty().withMessage("category is required."),
  validationErrorHandlerMiddleware,
  categoryAccessMiddleware,
  (req, _, next) => {
    if (!req.categoryIds.includes(req.body.categoryId)) {
      const error = new Error();
      error.code = 403;
      error.message = "403 Forbidden.";
      throw error;
    }
    next();
  },
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

    if (req.body.faq) {
      req.body.faq = JSON.parse(req.body.faq);

      req.body.faq = req.body.faq.filter((fa) => {
        if (fa && !(fa.question === "" || fa.answer === "")) {
          return fa;
        }
      });
    }

    if (req.body.pros) {
      req.body.pros = JSON.parse(req.body.pros);

      req.body.pros = req.body.pros.filter((pro) => {
        if (pro) {
          return pro;
        }
      });
    }

    if (req.body.cons) {
      req.body.cons = JSON.parse(req.body.cons);

      req.body.cons = req.body.cons.filter((con) => {
        if (con) {
          return con;
        }
      });
    }

    if (req.body.title) {
      req.body.title = capitalize_first_letter(req.body.title.trim(), " ");
    }
    next();
  },
  body("title")
    .notEmpty()
    .withMessage("title is required.")
    .custom((value) => {
      return Product.findOneWithDeleted({ title: value }).then((product) => {
        if (product) {
          return Promise.reject("product already exists.");
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
  body("pros").custom((value, { req }) => {
    if (!Array.isArray(value)) {
      req.body.pros = [];
      return true;
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;

      if (!element) {
        message[index] = "pros is required.";
        localError = true;
      }

      req.body.pros[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "pros is not allowed.";
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
  body("cons").custom((value, { req }) => {
    if (!Array.isArray(value)) {
      req.body.cons = [];
      return true;
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;

      if (!element) {
        message[index] = "cons is required.";
        localError = true;
      }

      req.body.cons[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "cons is not allowed.";
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
  // body("descriptionSeo").notEmpty().withMessage("description seo is required."),
  body("descriptionShort")
    .notEmpty()
    .withMessage("description short is required.")
    .custom((value) => {
      const replacedDesc = value.replaceAll(
        /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replacedDesc)) {
        throw "descriptionShort is not allowed.";
      }

      return true;
    }),
  // body("active").notEmpty().withMessage("active is required."),
  // body("showHomePage").notEmpty().withMessage("showHomePage is required."),
  body("slug")
    .notEmpty()
    .withMessage("slug is required.")
    .custom((value) => {
      return Product.findOneWithDeleted({ slug: value }).then((product) => {
        if (product) {
          return Promise.reject("product already exists.");
        }
      });
    }),
  // body("siteUrl").notEmpty().withMessage("siteUrl is required."),
  body("brandId").notEmpty().withMessage("brand is required."),
  // body("overalRating")
  //   .notEmpty()
  //   .withMessage("overal rating is required.")
  //   .isNumeric()
  //   .withMessage("overal rating must be number"),
  // body("star")
  //   .notEmpty()
  //   .withMessage("star is required.")
  //   .isNumeric()
  //   .withMessage("star must be number"),
  validationErrorHandlerMiddleware,
  productController.create
);

router.patch(
  "/admin/products/:_id/slug-edit",
  adminMiddleware,
  categoryAccessMiddleware,
  body("slug")
    .notEmpty()
    .withMessage("slug is required.")
    .custom((value) => {
      return Product.findOneWithDeleted({
        slug: value,
      }).then((product) => {
        if (product) {
          return Promise.reject("product already exists.");
        }
      });
    })
    .custom((value) => {
      if (!value.includes("/")) {
        throw new Error("slug must have / in it");
      } else {
        return true;
      }
    }),
  validationErrorHandlerMiddleware,
  productController.updateSlug
);

router.put(
  "/admin/products/:_id",
  adminMiddleware,
  categoryAccessMiddleware,
  // imageUpload,
  (req, _, next) => {
    if (!req.categoryIds.includes(req.body.categoryId)) {
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

    if (req.body.pros) {
      req.body.pros = JSON.parse(req.body.pros);

      req.body.pros = req.body.pros.filter((pro) => {
        if (pro) {
          return pro;
        }
      });
    }

    if (req.body.cons) {
      req.body.cons = JSON.parse(req.body.cons);

      req.body.cons = req.body.cons.filter((con) => {
        if (con) {
          return con;
        }
      });
    }
    if (req.body.title) {
      req.body.title = capitalize_first_letter(req.body.title.trim(), " ");
    }

    next();
  },
  body("title")
    .notEmpty()
    .withMessage("title is required.")
    .custom((value, { req }) => {
      return Product.findOneWithDeleted({
        title: value,
        _id: { $ne: req.params._id },
      }).then((product) => {
        if (product) {
          return Promise.reject("product already exists.");
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
  body("pros").custom((value, { req }) => {
    if (!Array.isArray(value)) {
      req.body.pros = [];
      return true;
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;

      if (!element) {
        message[index] = "pros is required.";
        localError = true;
      }

      req.body.pros[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "pros is not allowed.";
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
  body("cons").custom((value, { req }) => {
    if (!Array.isArray(value)) {
      req.body.cons = [];
      return true;
    }

    const message = [];
    let hasError = false;

    value.forEach((element, index) => {
      message[index] = {};
      let localError = false;

      if (!element) {
        message[index] = "cons is required.";
        localError = true;
      }

      req.body.cons[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "cons is not allowed.";
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
  // body("descriptionSeo").notEmpty().withMessage("description seo is required."),
  body("descriptionShort")
    .notEmpty()
    .withMessage("description short is required.")
    .custom((value) => {
      const replacedDesc = value.replaceAll(
        /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replacedDesc)) {
        throw "descriptionShort is not allowed.";
      }

      return true;
    }),
  // body("image").notEmpty().withMessage("image is required."),
  // body("active").notEmpty().withMessage("active is required."),
  // body("showHomePage").notEmpty().withMessage("showHomePage is required."),
  // body("siteUrl").notEmpty().withMessage("siteUrl is required."),
  body("brandId").notEmpty().withMessage("brand is required."),
  body("categoryId").notEmpty().withMessage("category is required."),
  // body("overalRating")
  //   .notEmpty()
  //   .withMessage("overal rating is required.")
  //   .isNumeric()
  //   .withMessage("overal rating must be number"),
  // body("star")
  //   .notEmpty()
  //   .withMessage("star is required.")
  //   .isNumeric()
  //   .withMessage("star must be number"),
  validationErrorHandlerMiddleware,
  productController.update
);

router.patch(
  "/admin/products/add-attribute",
  adminMiddleware,
  productController.addAttribute
);

router.patch(
  "/admin/products/image-update/:_id",
  adminMiddleware,
  productController.imageUpdate
);

router.patch(
  "/admin/products/star",
  adminMiddleware,
  productController.editStar
);

router.delete(
  "/admin/products/:_id",
  adminMiddleware,
  productController.remove
);

module.exports = router;
