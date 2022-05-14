const Brand = require("../../models/brand.model");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const imageUpdate = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params._id);

    if (req.files.image) {
      if (brand.image?.fileName) {
        UploadService.deleteFile(brand.image.fileName);
      }
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }

    if (req.files.imageSeo) {
      if (brand.imageSeo?.fileName) {
        UploadService.deleteFile(brand.imageSeo.fileName);
      }
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }

    if (req.files.headerImage) {
      if (brand.headerImage?.fileName) {
        UploadService.deleteFile(brand.headerImage.fileName);
      }
      try {
        req.body.headerImage = UploadService.singleUpload(
          req.files.headerImage,
          [250, 54],
          [500, 108],
          [1000, 217]
        );
      } catch (error) {
        return res.status(400).json({ error: { headerImage: [error] } });
      }
    }

    brand.image = {
      fileName: req.body.image || brand.image?.fileName,
      alt: req.body.imageAlt,
    };
    brand.headerImage = {
      fileName: req.body.headerImage || brand.headerImage?.fileName,
      alt: req.body.headerImageAlt,
    };
    brand.imageSeo = {
      fileName: req.body.imageSeo || brand.imageSeo?.fileName,
      alt: req.body.imageSeoAlt,
    };
    await brand.save();

    await LogService.create({
      model: "brand",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: brand._id,
      userId: req.user._id,
    });

    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
};

module.exports = imageUpdate;
