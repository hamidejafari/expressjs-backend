const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const create = async (req, res, next) => {
  try {
    const images = [];

    if (req.body?.imageCount > 0) {
      for (let i = 0; i < req.body.imageCount; i++) {
        try {
          images.push({
            fileName: UploadService.singleUpload(req.files["image" + i]),
            alt: req?.body["imageAlt" + i],
          });
        } catch (error) {
          return res.status(400).json({ error: { image: [error] } });
        }
      }
    }

    const beforeAfters = [];
    if (req.body?.beforAfterCount > 0) {
      for (let i = 0; i < req.body.beforAfterCount; i++) {
        try {
          beforeAfters.push({
            fileName: UploadService.singleUpload(req.files["beforAfter" + i]),
            alt: req?.body["beforAfterAlt" + i],
          });
        } catch (error) {
          return res.status(400).json({ error: { beforAfter: [error] } });
        }
      }
    }

    if (req.files.imageSeo) {
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
      }
    }

    let youtubeVideoLink = req.body.youtubeVideoLink;
    const iframeRegex = new RegExp("iframe", "i");
    if (iframeRegex.test(youtubeVideoLink)) {
      const link = youtubeVideoLink;
      const a = link.split('src="');
      const b = a[1].split('"');
      youtubeVideoLink = b[0];
    }

    const category = await Category.findById(req.body.categoryId);

    let tagIds = [];
    if (req.body.tagIds) {
      tagIds = JSON.parse(req.body.tagIds);
    }
    
    const product = new Product({
      title: req.body.title,
      titleSeo: req.body.titleSeo,
      description: req.body.description,
      images: images,
      beforeAfters: beforeAfters,
      imageSeo: {
        fileName: req.body.imageSeo,
        alt: req.body.imageSeoAlt,
      },
      special: req.body.special,
      faq: req.body.faq,
      pros: req.body.pros,
      tagIds: tagIds,
      cons: req.body.cons,
      descriptionSeo: req.body.descriptionSeo,
      descriptionShort: req.body.descriptionShort,
      siteUrl: req.body.siteUrl,
      overalRating: req.body.overalRating,
      star: req.body.star,
      showHomePage: req.body.showHomePage,
      h1: req.body.h1,
      categoryId: req.body.categoryId,
      categoryStanding: req.body.categoryStanding,
      published: req.body.published,
      noIndex: req.body.noIndex,
      brandId: req.body.brandId,
      slug: "products/" + req.body.slug,
      utmLink: req.body.utmLink,
      youtubeVideoLink: youtubeVideoLink,
    });

    let arr = [req.body.categoryId];
    if (req.body.extraCategories) {
      arr = [req.body.categoryId, ...JSON.parse(req.body.extraCategories)];
    }
    product.extraCategories = [...new Set(arr)];

    if (category.active) {
      product.active = true;
    }

    if (req.body.publishDat && req.body.published == true) {
      product.publishDate = req.body.publishDate;
    }

    await product.save();

    await LogService.create({
      model: "product",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: product._id,
      userId: req.user._id,
    });

    if (product.published && product.active) {
      const body = {
        _id: product._id,
        title: product.title,
        slug: product.slug,
      };

      if (product?.image?.fileName) {
        body.image = "files/images/small/" + product?.image?.fileName;
      }
      await elasticsearchService.put("products", body);
    }

    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

module.exports = create;
