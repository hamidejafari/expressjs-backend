const Product = require("../../models/product.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const update = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params._id);

    const images = [];
    if (req.body?.imageCount > 0) {
      for (let i = 0; i < req.body.imageCount; i++) {
        if (req?.body["imageOld" + i] === "false") {
          try {
            images.push({
              fileName: UploadService.singleUpload(req.files["image" + i]),
              alt: req?.body["imageAlt" + i],
            });
          } catch (error) {
            return res.status(400).json({ error: { image: [error] } });
          }
        } else {
          images.push({
            fileName: req?.body["imageName" + i],
            alt: req?.body["imageAlt" + i],
          });
        }
      }
    }

    const beforeAfters = [];
    if (req.body?.beforeAfterCount > 0) {
      for (let i = 0; i < req.body.beforeAfterCount; i++) {
        if (req?.body["beforeAfterOld" + i] === "false") {
          try {
            beforeAfters.push({
              fileName: UploadService.singleUpload(
                req.files["beforeAfter" + i]
              ),
              alt: req?.body["beforeAfterAlt" + i],
            });
          } catch (error) {
            return res.status(400).json({ error: { beforeAfter: [error] } });
          }
        } else {
          beforeAfters.push({
            fileName: req?.body["beforeAfterName" + i],
            alt: req?.body["beforeAfterAlt" + i],
          });
        }
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

    product.title = req.body.title;
    product.slug = req.body.slug || product.slug;
    product.titleSeo = req.body.titleSeo;
    product.description = req.body.description;
    product.faq = req.body.faq;
    product.pros = req.body.pros;
    product.cons = req.body.cons;
    if (req.body.tagIds) {
      product.tagIds = JSON.parse(req.body.tagIds);
    } else {
      product.tagIds = [];
    }
    product.descriptionSeo = req.body.descriptionSeo;
    product.descriptionShort = req.body.descriptionShort;
    product.siteUrl = req.body.siteUrl;
    product.overalRating = req.body.overalRating;
    product.special = req.body.special;
    product.star = req.body.star;
    product.showHomePage = req.body.showHomePage;
    product.h1 = req.body.h1;
    product.categoryId = req.body.categoryId;

    let arr = [req.body.categoryId];
    if (req.body.extraCategories) {
      arr = [req.body.categoryId, ...JSON.parse(req.body.extraCategories)];
    }
    product.extraCategories = [...new Set(arr)];

    product.categoryStanding = req.body.categoryStanding;
    product.brandId = req.body.brandId;
    product.utmLink = req.body.utmLink;

    let youtubeVideoLink = req.body.youtubeVideoLink;
    const iframeRegex = new RegExp("iframe", "i");
    if (iframeRegex.test(youtubeVideoLink)) {
      const link = youtubeVideoLink;
      const a = link.split('src="');
      const b = a[1].split('"');
      youtubeVideoLink = b[0];
    }

    product.youtubeVideoLink = youtubeVideoLink;

    product.published = req.body.published;
    product.noIndex = req.body.noIndex;

    if (req.body.publishDate) {
      product.publishDate = req.body.publishDate;
    }

    // product.image = {
    //   fileName: req.body.image || product.image?.fileName,
    //   alt: req.body.imageAlt,
    // };

    product.images = images;
    product.beforeAfters = beforeAfters;
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
    } else {
      await elasticsearchService.delete("products", product._id);
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
