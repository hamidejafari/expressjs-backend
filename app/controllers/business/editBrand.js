const BusinessBrand = require("../../models/businessBrand.model");
const UploadService = require("../../services/upload.service");

const editBrand = async (req, res, next) => {
  try {
    if (req.files.image) {
      try {
        req.body.image = UploadService.singleUploadBusiness(
          req.files.image,
          [200, 200],
          [400, 400],
          [800, 800]
        );
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    }

    let businessBrand = await BusinessBrand.findOne({ userId: req.user._id });
    if (businessBrand) {
      businessBrand.title = req.body.title;
      businessBrand.siteUrl = req.body.siteUrl;
      businessBrand.descriptionShort = req.body.description;
      businessBrand.image = req.body.image;
      businessBrand.faq = req.body.faq;
      businessBrand.pros = req.body.pros;
      businessBrand.cons = req.body.cons;
      businessBrand.status = "pending";
      await businessBrand.save();
    } else {
      businessBrand = new BusinessBrand({
        title: req.body.title,
        siteUrl: req.body.siteUrl,
        descriptionShort: req.body.description,
        image: req.body.image,
        faq: req.body.faq,
        pros: req.body.pros,
        cons: req.body.cons,
        status: "pending",
      });
      await businessBrand.save();
    }

    res.status(200).json(businessBrand);
  } catch (err) {
    next(err);
  }
};

module.exports = editBrand;
