const Category = require("../../models/category.model");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const imageUpdate = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params._id);

    if (req.files.icon) {
      if (category.icon?.fileName) {
        UploadService.deleteFile(category.icon.fileName);
      }
      try {
        req.body.icon = UploadService.singleUpload(
          req.files.icon,
          [50, 50],
          [300, 396],
          [700, 700]
        );
      } catch (error) {
        return res.status(400).json({ error: { icon: [error] } });
      }
    }

    if (req.files.iconSeo) {
      if (category.iconSeo?.fileName) {
        UploadService.deleteFile(category.iconSeo.fileName);
      }
      try {
        req.body.iconSeo = UploadService.singleUpload(
          req.files.iconSeo,
          [50, 50],
          [300, 396],
          [700, 700]
        );
      } catch (error) {
        return res.status(400).json({ error: { iconSeo: [error] } });
      }
    }

    if (req.files.headerImage) {
      if (category.headerImage?.fileName) {
        UploadService.deleteFile(category.headerImage.fileName);
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

    category.icon = {
      fileName: req.body.icon || category.icon?.fileName,
      alt: req.body.iconAlt,
    };
    category.headerImage = {
      fileName: req.body.headerImage || category.headerImage?.fileName,
      alt: req.body.headerImageAlt,
    };
    category.iconSeo = {
      fileName: req.body.iconSeo || category.iconSeo?.fileName,
      alt: req.body.iconSeoAlt,
    };
    await category.save();

    await LogService.create({
      model: "category",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: category._id,
      userId: req.user._id,
    });

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = imageUpdate;
