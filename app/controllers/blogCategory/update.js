const BlogCategory = require("../../models/blogCategory.model");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const update = async (req, res, next) => {
  try {
    const blogCategory = await BlogCategory.findById(req.params._id);

    if (req.files.image) {
      if (blogCategory.image) {
        UploadService.deleteFile(blogCategory.image.fileName);
      }
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }

    if (req.files.imageSeo) {
      if (blogCategory.imageSeo) {
        UploadService.deleteFile(blogCategory.imageSeo.fileName);
      }
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }

    blogCategory.title = req.body.title;
    blogCategory.slug = req.body.slug;
    blogCategory.titleSeo = req.body.titleSeo;
    blogCategory.h1 = req.body.h1;
    blogCategory.description = req.body.description;
    blogCategory.descriptionSeo = req.body.descriptionSeo;
    blogCategory.categoryId = req.body.categoryId;
    if (req.body.image || blogCategory.image?.fileName) {
      blogCategory.image = {
        fileName: req.body.image || blogCategory.image?.fileName,
        alt: req.body.imageAlt,
      };
    } else {
      blogCategory.image = {};
    }
    if (req.body.imageSeo || blogCategory.imageSeo?.fileName) {
      blogCategory.imageSeo = {
        fileName: req.body.imageSeo || blogCategory.imageSeo?.fileName,
        alt: req.body.imageSeoAlt,
      };
    } else {
      blogCategory.imageSeo = {};
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

module.exports = update;
