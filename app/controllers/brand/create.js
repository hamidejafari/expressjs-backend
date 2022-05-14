const Brand = require("../../models/brand.model");
const BusinessBrand = require("../../models/businessBrand.model");
const Category = require("../../models/category.model");
const elasticsearchService = require("../../services/elasticsearch.service");
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

    if (req.files.imageProduct) {
      try {
        req.body.imageProduct = UploadService.singleUpload(
          req.files.imageProduct
        );
      } catch (error) {
        return res.status(400).json({ error: { imageProduct: [error] } });
      }
    }

    if (req.files.imageSeo) {
      try {
        req.body.imageSeo = UploadService.singleUpload(req.files.imageSeo);
      } catch (error) {
        return res.status(400).json({ error: { imageSeo: [error] } });
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

    let youtubeVideoLink = req.body.youtubeVideoLink;
    const iframeRegex = new RegExp("iframe", "i");
    if (iframeRegex.test(youtubeVideoLink)) {
      const link = youtubeVideoLink;
      const a = link.split('src="');
      const b = a[1].split('"');
      youtubeVideoLink = b[0];
    }

    const brand = new Brand({
      title: req.body.title,
      titleSeo: req.body.titleSeo,
      categories: req.body.category,
      faq: req.body.faq,
      special: req.body.special,
      description: req.body.description,
      descriptionSeo: req.body.descriptionSeo,
      descriptionShort: req.body.descriptionShort,
      overalRating: req.body.overalRating,
      star: req.body.star,
      pros: req.body.pros,
      cons: req.body.cons,
      published: req.body.published,
      noIndex: req.body.noIndex,
      siteUrl: req.body.siteUrl,
      image: { fileName: req.body.image, alt: req.body.imageAlt },
      imageProduct: {
        fileName: req.body.imageProduct,
        alt: req.body.imageProductAlt,
      },
      headerImage: {
        fileName: req.body.headerImage,
        alt: req.body.headerImageAlt,
      },
      imageSeo: {
        fileName: req.body.imageSeo,
        alt: req.body.imageSeoAlt,
      },
      showHomePage: req.body.showHomePage,
      h1: req.body.h1,
      slug: req.body.slug,
      flag: req.body.flag,
      utmLink: req.body.utmLink,
      youtubeVideoLink: youtubeVideoLink,
      searchTags: req.body.searchTags,
    });

    if (req.body.publishDate) {
      brand.publishDate = req.body.publishDate;
    }

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
    }

    if (req.body.siteUrl) {
      const businessBrand = await BusinessBrand.findOne({
        siteUrl: req.body.siteUrl,
        brandId: { $exists: false },
      });

      if (businessBrand) {
        businessBrand.brandId = brand._id;
        await businessBrand.save();
      }
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

module.exports = create;
