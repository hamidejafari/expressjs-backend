const express = require("express"),
  router = express.Router();

const contactUsController = require("../controllers/contactUs");
const adminMiddleware = require("../middleware/admin");
// const imageUpload = require("../middleware/imageUpload");

router.get("/admin/contactUs", adminMiddleware, contactUsController.adminAll);

router.patch("/admin/contactUs/:_id/mark-as-read", adminMiddleware, contactUsController.markAsRead);

router.patch("/admin/contactUs/:_id/mark-as-unread", adminMiddleware, contactUsController.markAsUnread);

router.delete("/admin/contactUs/:_id", adminMiddleware, contactUsController.remove);

module.exports = router;
