const BlogCategory = require("../../models/blogCategory.model");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const create = async (req, res, next) => {
  try {
    if (req.files.image) {
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }
    if (req.files.imageSeo) {
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }
    const blogCategory = new BlogCategory({
      title: req.body.title,
      slug: req.body.slug,
      titleSeo: req.body.titleSeo,
      h1: req.body.h1,
      description: req.body.description,
      descriptionSeo: req.body.descriptionSeo,
      categoryId: req.body.categoryId,
    });

    if (req.body.image) {
      blogCategory.image = {
        fileName: req.body.image,
        alt: req.body.imageAlt,
      };
    }

    if (req.body.imageSeo) {
      blogCategory.image = {
        fileName: req.body.imageSeo,
        alt: req.body.imageSeoAlt,
      };
    }

    await blogCategory.save();

    await LogService.create({
      model: "blogCategory",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: blogCategory._id,
      userId: req.user._id,
    });

    res.status(200).json(blogCategory);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
