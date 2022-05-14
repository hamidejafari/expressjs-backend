const express = require("express"),
  router = express.Router();
const { body } = require("express-validator");

const validationErrorHandlerMiddleware = require("../middleware/validationErrorHandler");
const roleController = require("../controllers/role");
const adminMiddleware = require("../middleware/admin");

router.post(
  "/admin/roles",
  (req, _, next) => {
    req.requestedUrl = "/admin/roles";
    next();
  },
  adminMiddleware,
  (req, _, next) => {
    if (req.body.categories) {
      req.body.categories = JSON.parse(req.body.categories);
    }
    if (req.body.frontPermissions) {
      req.body.frontPermissions = JSON.parse(req.body.frontPermissions);
    }
    if (req.body.backPermissions) {
      req.body.backPermissions = JSON.parse(req.body.backPermissions);
    }
    next();
  },
  body("title").notEmpty().withMessage("title is required."),
  validationErrorHandlerMiddleware,
  roleController.create
);

router.put(
  "/admin/roles/:_id",
  (req, _, next) => {
    req.requestedUrl = "/admin/roles/:_id";
    next();
  },
  adminMiddleware,
  (req, _, next) => {
    if (req.body.categories) {
      req.body.categories = JSON.parse(req.body.categories);
    }
    if (req.body.frontPermissions) {
      req.body.frontPermissions = JSON.parse(req.body.frontPermissions);
    }
    if (req.body.backPermissions) {
      req.body.backPermissions = JSON.parse(req.body.backPermissions);
    }
    next();
  },
  body("title").notEmpty().withMessage("title is required."),
  validationErrorHandlerMiddleware,
  roleController.update
);

router.get("/admin/roles", adminMiddleware, roleController.adminAll);

router.get("/admin/roles/:_id", adminMiddleware, roleController.findOne);

module.exports = router;
