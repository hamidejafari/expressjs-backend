const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const brandController = require("../controllers/brand");
const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const adminMiddleware = require("../middleware/admin");
// const imageUpload = require("../middleware/imageUpload");
const capitalize_first_letter = require("../helpers/capitalize_first_letter");
const categoryAccessMiddleware = require("../middleware/categoryAccess");
const Brand = require("../models/brand.model");

router.get("/admin/brands", adminMiddleware, brandController.adminAll);

router.get(
  "/admin/brands-select-box",
  adminMiddleware,
  categoryAccessMiddleware,
  brandController.adminSelectBox
);


router.patch(
  "/admin/brands/add-attribute",
  adminMiddleware,
  brandController.addAttribute
);


router.get(
  "/admin/brands/trash",
  adminMiddleware,
  brandController.adminAllTrash
);

router.post(
  "/admin/brands/restore/:_id",
  adminMiddleware,
  brandController.restore
);

router.get("/admin/brands/:_id", brandController.findOne);

router.post(
  "/admin/brands",
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

    if (req.body.category) {
      req.body.category = JSON.parse(req.body.category);
    }

    if (req.body.searchTags) {
      req.body.searchTags = JSON.parse(req.body.searchTags);
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

    if (req.body.flag) {
      req.body.flag = JSON.parse(req.body.flag);
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
      return Brand.findOneWithDeleted({ title: value }).then((brand) => {
        if (brand) {
          return Promise.reject("brand already exists.");
        }
      });
    }),
  // body("titleSeo").notEmpty().withMessage("title seo is required."),
  body("category")
    .notEmpty()
    .withMessage("category is required.")
    .custom((value) => {
      if (!Array.isArray(value)) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage("category is not array."),
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
  // body("image").notEmpty().withMessage("image is required."),
  // body("active").notEmpty().withMessage("active is required."),
  // body("showHomePage").notEmpty().withMessage("showHomePage is required."),
  body("slug")
    .notEmpty()
    .withMessage("slug is required.")
    .custom((value) => {
      return Brand.findOneWithDeleted({ slug: value }).then((brand) => {
        if (brand) {
          return Promise.reject("brand already exists.");
        }
      });
    }),
  // body("siteUrl").notEmpty().withMessage("siteUrl is required."),
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
  brandController.create
);

router.put(
  "/admin/brands/:_id",
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

    if (req.body.searchTags) {
      req.body.searchTags = JSON.parse(req.body.searchTags);
    }

    if (req.body.category) {
      req.body.category = JSON.parse(req.body.category);
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

    if (req.body.flag) {
      req.body.flag = JSON.parse(req.body.flag);
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
      return Brand.findOneWithDeleted({
        title: value,
        _id: { $ne: req.params._id },
      }).then((brand) => {
        if (brand) {
          return Promise.reject("brand already exists.");
        }
      });
    }),
  // body("titleSeo").notEmpty().withMessage("title seo is required."),
  body("category")
    .notEmpty()
    .withMessage("category is required.")
    .custom((value) => {
      if (!Array.isArray(value)) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage("category is not array."),
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
  // body("image").notEmpty().withMessage("image is required."),
  // body("active").notEmpty().withMessage("active is required."),
  // body("showHomePage").notEmpty().withMessage("showHomePage is required."),
  // body("siteUrl").notEmpty().withMessage("siteUrl is required."),
  body("overalRating")
    // .notEmpty()
    // .withMessage("overal rating is required.")
    .isNumeric()
    .withMessage("overal rating must be number"),
  body("star")
    // .notEmpty()
    // .withMessage("star is required.")
    .isNumeric()
    .withMessage("star must be number"),
  validationErrorHandlerMiddleware,
  brandController.update
);


router.patch(
  "/admin/brands/image-update/:_id",
  adminMiddleware,
  brandController.imageUpdate
);

router.delete("/admin/brands/:_id", adminMiddleware, brandController.remove);

module.exports = router;
