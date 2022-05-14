const express = require("express"),
  router = express.Router();
const businessController = require("../controllers/business");

const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const { body } = require("express-validator");
const businessMiddleware = require("../middleware/business");

//Auth
router.post(
  "/site/business/register",
  body("companyName").notEmpty().withMessage("Company Name is required."),
  body("name").notEmpty().withMessage("First name is required."),
  body("name").custom((value) => {
    if (value && value.length > 30) {
      throw "First name is too long (30 characters allowed).";
    }
    return true;
  }),
  body("family").notEmpty().withMessage("Last name is required."),
  body("family").custom((value) => {
    if (value && value.length > 30) {
      throw "Last name is too long (30 characters allowed).";
    }
    return true;
  }),
  body("website").notEmpty().withMessage("Website is required."),
  body("email").isEmail().withMessage("email is not valid."),
  body("phoneNumber").notEmpty().withMessage("Phone number is required."),
  body("phoneNumber").custom((value) => {
    var validRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g;
    if (value && !value.match(validRegex)) {
      throw "Phone number is not valid.";
    }
    if (value && value.length > 15) {
      throw "Phone number is not valid.";
    }
    return true;
  }),
  validationErrorHandlerMiddleware,
  businessController.register
);

router.post(
  "/site/business/confirm",
  body("email").isEmail().withMessage("email is not valid."),
  body("code").notEmpty().withMessage("Confirm code is required."),
  validationErrorHandlerMiddleware,
  businessController.confirm
);

router.post(
  "/site/business/login",
  body("email").isEmail().withMessage("email is not valid."),
  body("code").notEmpty().withMessage("Confirm code is required."),
  validationErrorHandlerMiddleware,
  businessController.login
);

router.get("/site/business/check/:website", businessController.check);

router.get(
  "/site/business/user-details",
  businessMiddleware,
  businessController.userDetails
);

//Brand

router.put(
  "/site/business/brand",
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
  // body("image").notEmpty().withMessage("Company logo is required."),
  body("title").notEmpty().withMessage("Company name is required."),
  body("siteUrl")
    .notEmpty()
    .withMessage("Website is required.")
    .custom((value) => {
      if (value && !value.includes(".")) {
        throw "Website is not valid.";
      }
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .custom((value) => {
      if(value){
        const replacedDesc = value.replaceAll(
          /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
          ""
        );
        if (new RegExp("<[^>]*>").test(replacedDesc)) {
          throw "Description is not allowed.";
        }
  
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
        message[index] = "Cons is required.";
        localError = true;
      }

      req.body.cons[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "Cons is not allowed.";
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
        message[index].question = "Question is required.";
        localError = true;
      }

      if (!element.answer) {
        message[index].answer = "Answer is required.";
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
        message[index] = "Pros is required.";
        localError = true;
      }

      req.body.pros[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "Pros is not allowed.";
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
  validationErrorHandlerMiddleware,
  businessMiddleware,
  businessController.editBrand
);

router.put(
  "/site/business/brand-categories",
  (req, _, next) => {
    if (req.body.categories) {
      req.body.categories = JSON.parse(req.body.categories);
    }
    next();
  },
  body("categories")
    .notEmpty()
    .withMessage("Selecting at least one category is required."),
  validationErrorHandlerMiddleware,
  businessMiddleware,
  businessController.editCategories
);

router.get(
  "/site/business/category-level-two",
  businessController.categoryLevelTwo
);

router.get(
  "/site/business/category-level-three",
  businessController.categoryLevelThree
);

//Product

router.get(
  "/site/business/products",
  businessMiddleware,
  businessController.products
);

router.post(
  "/site/business/products",
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
  body("title").notEmpty().withMessage("Product name is required."),
  body("image").notEmpty().withMessage("Image is required."),
  body("categoryId").notEmpty().withMessage("Selecting category is required."),
  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .custom((value) => {
      if (value) {
        const replacedDesc = value.replaceAll(
          /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
          ""
        );
        if (new RegExp("<[^>]*>").test(replacedDesc)) {
          throw "Description is not allowed.";
        }
      }

      return true;
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
        message[index] = "Cons is required.";
        localError = true;
      }

      req.body.cons[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "Cons is not allowed.";
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
        message[index].question = "Question is required.";
        localError = true;
      }

      if (!element.answer) {
        message[index].answer = "Answer is required.";
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
        message[index] = "Pros is required.";
        localError = true;
      }

      req.body.pros[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "Pros is not allowed.";
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
  validationErrorHandlerMiddleware,
  businessMiddleware,
  businessController.createProduct
);

router.get(
  "/site/business/products/:_id",
  businessMiddleware,
  businessController.findOneProduct
);

router.put(
  "/site/business/products/:_id",
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
  body("title").notEmpty().withMessage("Product name is required."),
  body("categoryId").notEmpty().withMessage("Selecting category is required."),
  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .custom((value) => {
      if (value) {
        const replacedDesc = value.replaceAll(
          /<p>|<\/p>|<a[\w\s\d\-=":%&;/.]*>|<\/a>|<strong>|<\/strong>/g,
          ""
        );
        if (new RegExp("<[^>]*>").test(replacedDesc)) {
          throw "Description is not allowed.";
        }
      }

      return true;
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
        message[index] = "Cons is required.";
        localError = true;
      }

      req.body.cons[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "Cons is not allowed.";
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
        message[index].question = "Question is required.";
        localError = true;
      }

      if (!element.answer) {
        message[index].answer = "Answer is required.";
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
        message[index] = "Pros is required.";
        localError = true;
      }

      req.body.pros[index] = element.replaceAll(/<p>|<\/p>/g, "");
      element = element.replaceAll(/<p>|<\/p>/g, "");

      const replaced = element.replaceAll(
        /<a[\w\s\d\-=":/.]*>|<\/a>|<strong>|<\/strong>/g,
        ""
      );
      if (new RegExp("<[^>]*>").test(replaced)) {
        message[index] = "Pros is not allowed.";
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
  validationErrorHandlerMiddleware,
  businessMiddleware,
  businessController.updateProduct
);

//Review
router.get(
  "/site/business/reviews",
  businessMiddleware,
  businessController.reviews
);

router.delete(
  "/site/business/reviews/:_id",
  businessMiddleware,
  businessController.removeReview
);

module.exports = router;
