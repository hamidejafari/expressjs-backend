const Product = require("../../models/product.model");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const imageUpdate = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params._id);

    if (req.files.image) {
      if (product.image?.fileName) {
        UploadService.deleteFile(product.image.fileName);
      }
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }

    if (req.files.imageSeo) {
      if (product.imageSeo?.fileName) {
        UploadService.deleteFile(product.imageSeo.fileName);
      }
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }

    product.image = { fileName: req.body.image, alt: req.body.imageAlt };
    product.imageSeo = {
      fileName: req.body.imageSeo,
      alt: req.body.imageSeoAlt,
    };
    await product.save();

    await LogService.create({
      model: "product",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: product._id,
      userId: req.user._id,
    });

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = imageUpdate;
