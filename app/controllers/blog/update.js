const Blog = require("../../models/blog.model");
const UploadService = require("../../services/upload.service");
const LogService = require("../../services/log.service");

const update = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params._id);

    if (req.files.image) {
      if (blog.image) {
        UploadService.deleteFile(blog.image.fileName);
      }
      try {
        req.body.image = UploadService.singleUpload(
          req.files.image,
          [50, 50],
          [300, 396],
          [700, 700]
        );
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }

    if (req.files.beforeDescImage) {
      try {
        req.body.beforeDescImage = UploadService.singleUpload(
          req.files.beforeDescImage,
          [50, 50],
          [300, 396],
          [800, 800]
        );
      } catch (error) {
        return res.status(400).json({ error: { beforeDescImage: [error] } });
      }
    }
    if (req.files.afterDescImage) {
      try {
        req.body.afterDescImage = UploadService.singleUpload(
          req.files.afterDescImage,
          [50, 50],
          [300, 396],
          [800, 800]
        );
      } catch (error) {
        return res.status(400).json({ error: { afterDescImage: [error] } });
      }
    }

    if (req.files.imageSeo) {
      if (blog.imageSeo) {
        UploadService.deleteFile(blog.imageSeo.fileName);
      }
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }

    blog.title = req.body.title;
    blog.slug = req.body.slug;
    blog.titleSeo = req.body.titleSeo;
    blog.h1 = req.body.h1;
    if (req.body.description) {
      blog.description = req.body.description;
    }

    blog.shortDescription = req.body.shortDescription;
    blog.descriptionSeo = req.body.descriptionSeo;
    if (req.body.image || blog.image?.fileName) {
      blog.image = {
        fileName: req.body.image || blog.image?.fileName,
        alt: req.body.imageAlt,
      };
    } else {
      blog.image = {};
    }
    if (req.body.beforeDescImage || blog.beforeDescImage?.fileName) {
      blog.beforeDescImage = {
        fileName: req.body.beforeDescImage || blog.beforeDescImage?.fileName,
        alt: req.body.beforeDescImageAlt,
      };
    } else {
      blog.beforeDescImage = {};
    }
    if (req.body.afterDescImage || blog.afterDescImage?.fileName) {
      blog.afterDescImage = {
        fileName: req.body.afterDescImage || blog.afterDescImage?.fileName,
        alt: req.body.afterDescImageAlt,
      };
    } else {
      blog.afterDescImage = {};
    }
    if (req.body.imageSeo || blog.imageSeo?.fileName) {
      blog.imageSeo = {
        fileName: req.body.imageSeo || blog.imageSeo?.fileName,
        alt: req.body.imageSeoAlt,
      };
    } else {
      blog.imageSeo = {};
    }
    blog.relatedBlogs = req.body.relatedBlogs;
    blog.categoryId = req.body.categoryId;
    blog.blogCategoryId = req.body.blogCategoryId;

    // await elasticsearchService.put("blogs", {
    //   _id: blog._id,
    //   title: blog.title,
    //   slug: blog.slug,
    // });

    await blog.save();

    await LogService.create({
      model: "blog",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: blog._id,
      userId: req.user._id,
    });

    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
