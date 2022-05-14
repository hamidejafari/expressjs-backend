const Setting = require("../models/setting.model");

const express = require("express"),
  router = express.Router();
const fs = require("fs");
const LogService = require("../services/log.service");

router.get("/admin/setting/", async (req, res, next) => {
  try {
    const setting = await Setting.findOne().sort({ createdAt: 1 });
    res.status(200).json(setting);
  } catch (err) {
    next(err);
  }
});

router.put("/admin/setting/", async (req, res, next) => {
  try {
    const setting = await Setting.findOne().sort({ createdAt: 1 });
    setting.titleSeo = req.body.titleSeo;
    setting.description = req.body.description;
    setting.firstPageHeader = req.body.firstPageHeader;
    setting.firstPageHeaderBold = req.body.firstPageHeaderBold;
    setting.brandCount = req.body.brandCount;
    setting.comparisonCount = req.body.comparisonCount;
    setting.couponCount = req.body.couponCount;
    setting.bestRatingCount = req.body.bestRatingCount;
    setting.reviewCount = req.body.reviewCount;
    setting.footerInfo = req.body.footerInfo;
    setting.footerContent = req.body.footerContent;
    setting.footerContact = req.body.footerContact;
    setting.tiktok = req.body.tiktok;
    setting.facebook = req.body.facebook;
    setting.twitter = req.body.twitter;
    setting.pinterest = req.body.pinterest;
    setting.instagram = req.body.instagram;

    if (req.files.firstPageBanner) {
      const rawData = fs.readFileSync(req.files.firstPageBanner.filepath);
      fs.writeFileSync("files/headerperson.webp", rawData);
    }

    if (req.files.logo) {
      const rawDataLogo = fs.readFileSync(req.files.logo.filepath);
      fs.writeFileSync("files/brandslogo.webp", rawDataLogo);
    }

    if (req.files.favicon) {
      const rawDataFavicon = fs.readFileSync(req.files.favicon.filepath);
      fs.writeFileSync("files/logo.webp", rawDataFavicon);
    }

    await setting.save();

    await LogService.create({
      model: "setting",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: setting._id,
      userId: req.user._id,
    });

    res.status(200).json(setting);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
