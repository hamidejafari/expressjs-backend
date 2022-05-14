const Banner = require("../../models/banner.model");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const update = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params._id);

    if (req.files.image) {
      if (banner.image) {
        UploadService.deleteFile(banner.image.fileName);
      }
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }

    banner.image = {
      fileName: req.body.image || banner.image.fileName,
      alt: req.body.imageAlt,
    };
    banner.url = req.body.url;
    banner.selected = req.body.selected;

    banner.brandExceptions = JSON.parse(req.body.brandIds);
    banner.productExceptions = JSON.parse(req.body.productIds);

    if (req.body.startDate) {
      banner.startDate = new Date(req.body.startDate);
    } else {
      banner.startDate = null;
    }

    if (req.body.expireDate) {
      banner.expireDate = new Date(req.body.expireDate);
    } else {
      banner.expireDate = null;
    }

    await banner.save();

    await LogService.create({
      model: "banner",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: banner._id,
      userId: req.user._id,
    });

    res.status(200).json(banner);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
