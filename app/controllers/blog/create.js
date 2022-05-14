const Blog = require("../../models/blog.model");
// const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const create = async (req, res, next) => {
  try {
    if (req.files.image) {
      try {
        req.body.image = UploadService.singleUpload(
          req.files.image,
          [50, 50],
          [300, 396],
          [800, 800]
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
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }

    const blog = new Blog({
      title: req.body.title,
      slug: req.body.slug,
      titleSeo: req.body.titleSeo,
      h1: req.body.h1,
      blogCategoryId: req.body.blogCategoryId,
      categoryId: req.body.categoryId,
      shortDescription: req.body.shortDescription,
      descriptionSeo: req.body.descriptionSeo,
      imageSeo: req.body.image,
      description: req.body.description,
      relatedBlogs: req.body.relatedBlogs,
    });

    if (req.body.image) {
      blog.image = {
        fileName: req.body.image,
        alt: req.body.imageAlt,
      };
    }

    if (req.body.beforeDescImage) {
      blog.beforeDescImage = {
        fileName: req.body.beforeDescImage,
        alt: req.body.beforeDescImageAlt,
      };
    }

    if (req.body.afterDescImage) {
      blog.afterDescImage = {
        fileName: req.body.afterDescImage,
        alt: req.body.afterDescImageAlt,
      };
    }

    if (req.body.imageSeo) {
      blog.image = {
        fileName: req.body.imageSeo,
        alt: req.body.imageSeoAlt,
      };
    }

    await blog.save();

    // await elasticsearchService.put("blogs", {
    //   _id: blog._id,
    //   title: blog.title,
    //   slug: blog.slug,
    // });

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

module.exports = create;
