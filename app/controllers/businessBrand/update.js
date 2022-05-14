const BusinessBrand = require("../../models/businessBrand.model");
const Brand = require("../../models/brand.model");
const LogService = require("../../services/log.service");
const sanitizeHtml = require("sanitize-html");
const UploadService = require("../../services/upload.service");

const update = async (req, res, next) => {
  try {
    const businessBrand = await BusinessBrand.findById(req.params._id);

    if (req.files.image) {
      if (businessBrand.image) {
        UploadService.deleteFile(businessBrand.image);
      }
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    } else {
      req.body.image = businessBrand.image;
    }

    const brandPros = req.body.pros?.map((pro) =>
      sanitizeHtml(pro, {
        allowedTags: [],
      })
    );

    const brandCons = req.body.cons?.map((con) =>
      sanitizeHtml(con, {
        allowedTags: [],
      })
    );

    businessBrand.title = req.body.title;
    businessBrand.descriptionShort = sanitizeHtml(req.body.descriptionShort, {
      allowedTags: [],
    });
    businessBrand.image = req.body.image;
    businessBrand.siteUrl = req.body.siteUrl;
    businessBrand.faq = req.body.faq;
    businessBrand.pros = brandPros;
    businessBrand.cons = brandCons;
    businessBrand.status = "created by brandsreviews";

    if (!businessBrand.brandId) {
      const brand = new Brand({
        title: req.body.title,
        descriptionShort: req.body.descriptionShort,
        image: {
          fileName: req.body.image,
          alt: req.body.title,
        },
        siteUrl: req.body.siteUrl,
        faq: req.body.faq,
        pros: req.body.pros,
        cons: req.body.cons,
      });
      await brand.save();
      businessBrand.brandId = brand._id;
    } else {
      const brand = await Brand.findById(req.body.brandId);
      brand.title = req.body.title;
      brand.descriptionShort = req.body.descriptionShort;
      brand.image = {
        fileName: req.body.image,
        alt: req.body.title,
      };
      brand.siteUrl = req.body.siteUrl;
      brand.faq = req.body.faq;
      brand.pros = req.body.pros;
      brand.cons = req.body.cons;
      await brand.save();
    }
    await businessBrand.save();

    await LogService.create({
      model: "businessBrand",
      url: req.originalUrl,
      method: req.method,
      data: JSON.stringify(businessBrand),
      modelId: businessBrand._id,
      userId: req.user._id,
    });

    res.status(200).json(businessBrand);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
