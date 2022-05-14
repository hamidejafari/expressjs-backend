const Category = require("../../models/category.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const create = async (req, res, next) => {
  try {
    if (req.files.icon) {
      try {
        req.body.icon = UploadService.singleUpload(
          req.files.icon,
          [50, 50],
          [300, 396],
          [800, 800]
        );
      } catch (error) {
        return res.status(400).json({ error: { icon: [error] } });
      }
    }

    if (req.files.iconSeo) {
      try {
        req.body.iconSeo = UploadService.singleUpload(
          req.files.iconSeo,
          [50, 50],
          [300, 396],
          [800, 800]
        );
      } catch (error) {
        return res.status(400).json({ error: { iconSeo: [error] } });
      }
    }

    if (req.files.headerImage) {
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

    const category = new Category({
      title: req.body.title,
      titleSeo: req.body.titleSeo,
      description: req.body.description,
      descriptionSeo: req.body.descriptionSeo,
      faq: req.body.faq,
      icon: { fileName: req.body.icon, alt: req.body.iconAlt },
      headerImage: {
        fileName: req.body.headerImage,
        alt: req.body.headerImageAlt,
      },
      iconSeo: {
        fileName: req.body.iconSeo,
        alt: req.body.iconSeoAlt,
      },
      published: req.body.published,
      showHomePage: req.body.showHomePage,
      h1: req.body.h1,
      slug: req.body.slug,
      isOldSlug: req.body.slugOld,
      noIndex: req.body.noIndex,
      shortDescription: req.body.shortDescription,
    });

    if (req.body.publishDate) {
      category.publishDate = req.body.publishDate;
    }

    if (req.body.parentId) {
      const parent = await Category.findById(req.body.parentId);
      if (parent) {
        category.parentId = req.body.parentId;
        category.level = +parent.level + 1;
      }
    } else {
      category.level = 1;
    }

    await category.save();

    if (category.published && category.active) {
      const body = {
        _id: category._id,
        title: category.title,
        slug: category.slug,
        level: category.level,
      };

      if (category?.icon?.fileName) {
        body.image = "files/images/small/" + category?.icon?.fileName;
      }
      await elasticsearchService.put("categories", body);
    }
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

module.exports = create;
