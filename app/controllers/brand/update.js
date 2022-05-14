const Brand = require("../../models/brand.model");
const Category = require("../../models/category.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const update = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params._id);

    if (req.files.image) {
      if (brand.image) {
        UploadService.deleteFile(brand.image.fileName);
      }
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }

    if (req.files.imageProduct) {
      // if (brand.imageProduct && brand.imageProduct.fileName) {
      //   UploadService.deleteFile(brand.imageProduct.fileName);
      // }
      try {
        req.body.imageProduct = UploadService.singleUpload(
          req.files.imageProduct
        );
      } catch (error) {
        return res.status(400).json({ error: { imageProduct: [error] } });
      }
    }

    if (req.files.imageSeo) {
      if (brand.imageSeo) {
        UploadService.deleteFile(brand.imageSeo.fileName);
      }
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }

    if (req.files.headerImage) {
      if (brand.headerImage) {
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

    const catIds = [];

    if (Array.isArray(req.body.category)) {
      req.body.category.forEach((element) => {
        catIds.push(element._id);
      });

      const categories = await Category.find({ _id: { $in: catIds } }).populate(
        "parentId"
      );

      categories.forEach((element) => {
        if (element?.parentId?._id) {
          const exists = req.body.category.find((el) => {
            return el._id.toString() === element?.parentId?._id.toString();
          });

          if (!exists) {
            req.body.category.push({ _id: element.parentId._id });
          }
        }
      });
    }

    brand.title = req.body.title;
    brand.titleSeo = req.body.titleSeo;
    brand.categories = req.body.category;
    brand.faq = req.body.faq;
    brand.special = req.body.special;
    brand.description = req.body.description;
    brand.descriptionSeo = req.body.descriptionSeo;
    brand.descriptionShort = req.body.descriptionShort;
    brand.overalRating = req.body.overalRating;
    brand.star = req.body.star;
    brand.pros = req.body.pros;
    brand.cons = req.body.cons;
    brand.searchTags = req.body.searchTags;
    brand.siteUrl = req.body.siteUrl;
    brand.published = req.body.published;
    brand.noIndex = req.body.noIndex;
    if (req.body.publishDate) {
      brand.publishDate = req.body.publishDate;
    }
    brand.image = {
      fileName: req.body.image || brand.image?.fileName,
      alt: req.body.imageAlt,
    };
    brand.imageProduct = {
      fileName: req.body.imageProduct || brand.imageProduct?.fileName,
      alt: req.body?.imageProductAlt,
    };
    brand.headerImage = {
      fileName: req.body.headerImage || brand.headerImage?.fileName,
      alt: req.body.headerImageAlt,
    };
    brand.imageSeo = {
      fileName: req.body.imageSeo || brand.imageSeo?.fileName,
      alt: req.body.imageSeoAlt,
    };

    brand.showHomePage = req.body.showHomePage;
    brand.h1 = req.body.h1;
    brand.slug = req.body.slug || brand.slug;
    brand.flag = req.body.flag;
    brand.utmLink = req.body.utmLink;

    let youtubeVideoLink = req.body.youtubeVideoLink;
    const iframeRegex = new RegExp("iframe", "i");
    if (iframeRegex.test(youtubeVideoLink)) {
      const link = youtubeVideoLink;
      const a = link.split('src="');
      const b = a[1].split('"');
      youtubeVideoLink = b[0];
    }

    brand.youtubeVideoLink = youtubeVideoLink;

    await brand.save();

    if (brand.published && brand.active) {
      const body = {
        _id: brand._id,
        title: brand.title,
        slug: brand.slug,
        searchTags: brand.searchTags,
      };

      if (brand?.image?.fileName) {
        body.image = "files/images/small/" + brand?.image?.fileName;
      }

      await elasticsearchService.put("brands", body);
    } else {
      await elasticsearchService.delete("brands", brand._id);
    }

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

module.exports = update;
