const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const userController = require("../controllers/user");
const User = require("../models/user.model");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

router.post(
  "/users",

  body("phoneNumber")
    .custom(async (value) => {
      const user = await User.findOneWithDeleted({ phoneNumber: value });
      if (user) {
        return Promise.reject("phone number already in use.");
      } else {
        return true;
      }
    })
    .notEmpty()
    .withMessage("phone number is required."),
  body("password").notEmpty().withMessage("password is required."),
  validationErrorHandlerMiddleware,
  userController.create
);

router.post(
  "/users/login",
  body("username").notEmpty().withMessage("username is required."),
  body("password").notEmpty().withMessage("password is required."),
  validationErrorHandlerMiddleware,
  userController.login
);

router.get("/admin-details", adminMiddleware, userController.userDetails);

router.get("/admin/users", authMiddleware, userController.all);

router.get("/admin/all-admins", authMiddleware, userController.allAdmins);

router.put(
  "/admin/update-admin/:_id",
  adminMiddleware,
  userController.updateAdmin
);

router.get("/admin/users/:_id", adminMiddleware, userController.getOneAdmin);

router.post(
  "/admin/create-admin",
  adminMiddleware,
  (req, _, next) => {
    req.body.roles = JSON.parse(req.body.roles);
    next();
  },
  userController.createAdmin
);


router.post(
  "/users/forget-password",
  body("email").isEmail().withMessage("email is not valid."),
  validationErrorHandlerMiddleware,
  userController.forgetPassword
);


module.exports = router;
