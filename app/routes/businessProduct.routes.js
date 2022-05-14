const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const adminMiddleware = require("../middleware/admin");
const businessProductController = require("../controllers/businessProduct");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const Product = require("../models/product.model");

router.get(
  "/admin/business-products",
  adminMiddleware,
  businessProductController.adminAll
);

router.get(
  "/admin/business-products/:_id",
  adminMiddleware,
  businessProductController.findOne
);

router.patch(
  "/admin/business-products/:_id",
  adminMiddleware,
  body("status").notEmpty().withMessage("status is required."),
  validationErrorHandlerMiddleware,
  businessProductController.patch
);

router.put(
  "/admin/business-products/:_id",
  adminMiddleware,
  (req, _, next) => {
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

    next();
  },
  body("title")
    .notEmpty()
    .withMessage("title is required.")
    .custom((value, { req }) => {
      return Product.findOneWithDeleted({
        title: value,
        _id: { $ne: req.body.productId },
      }).then((product) => {
        if (product) {
          return Promise.reject("product already exists.");
        }
      });
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
  body("descriptionShort")
    // .notEmpty()
    // .withMessage("description short is required.")
    .custom((value) => {
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
  businessProductController.update
);

module.exports = router;
