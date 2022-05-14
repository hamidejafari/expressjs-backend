const Category = require("../../models/category.model");
const Brand = require("../../models/brand.model");
const LogService = require("../../services/log.service");
const elasticsearchService = require("../../services/elasticsearch.service");
const UploadService = require("../../services/upload.service");

const update = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params._id);

    if (req.files.icon) {
      if (category.icon) {
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
      if (category.iconSeo) {
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
      if (category.headerImage) {
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

    category.title = req.body.title;

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

    // if (req.body.titleSeo) {
    category.titleSeo = req.body.titleSeo;
    // }

    if (req.body.description) {
      category.description = req.body.description;
    }
    category.descriptionSeo = req.body.descriptionSeo;

    category.h1 = req.body.h1;
    category.shortDescription = req.body.shortDescription;

    category.published = req.body.published;
    category.noIndex = req.body.noIndex;
    category.faq = req.body.faq;

    if (req.body.publishDate) {
      category.publishDate = req.body.publishDate;
    }

    category.showHomePage = req.body.showHomePage;

    if (req.body.slug) {
      category.slug = req.body.slug;
    }

    // category.slug = req.body.slug;
    // category.isOldSlug = req.body.slugOld;

    const oldLevel = category.level;
    const oldParent = category.parentId;

    if (category.parentId?.toString() !== req.body.parentId?.toString()) {
      let parent = await Category.findById(req.body.parentId);
      if (!parent) {
        parent = { level: 0 };
      }
      category.parentId = req.body.parentId;
      if (+category.level === 3) {
        category.level = +parent.level + 1;
      } else if (+category.level === 2) {
        const children = await Category.find({ parentId: category._id });

        for await (const child of children) {
          child.level = +parent.level + 2;
          await child.save();
        }
        category.level = +parent.level + 1;
      } else if (category.level === 1) {
        const children = await Category.find({ parentId: category._id });
        for await (const child of children) {
          const childrenChilds = await Category.find({
            parentId: child._id,
          });

          for await (const c of childrenChilds) {
            c.level = +parent.level + 3;
            await c.save();
          }

          child.level = +parent.level + 2;
          await child.save();
        }
        category.level = +parent.level + 1;
      }

      if (oldLevel === 2) {
        const brands = await Brand.find({
          categories: { $elemMatch: { _id: category._id } },
        });
        for await (const brand of brands) {
          const newBrandCat = brand.categories.filter((element) => {
            return element._id.toString() !== oldParent?.toString();
          });
          newBrandCat.push({ _id: req.body.parentId });
          brand.categories = newBrandCat;
          await brand.save();
        }
      }
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
    } else {
      await elasticsearchService.delete("categories", category._id);
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

module.exports = update;
