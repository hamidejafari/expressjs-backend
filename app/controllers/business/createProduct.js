const UploadService = require("../../services/upload.service");
const BusinessProduct = require("../../models/businessProduct.model");
const BusinessBrand = require("../../models/businessBrand.model");

const createProduct = async (req, res, next) => {
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

    const businessBrand = await BusinessBrand.findOne({ userId: req.user._id });

    const businessProduct = new BusinessProduct({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      faq: req.body.faq,
      pros: req.body.pros,
      cons: req.body.cons,
      categoryId: req.body.categoryId,
      brandId: businessBrand?.brandId,
      userId: req.user._id,
      businessBrandId: businessBrand._id,
      status: "pending",
    });

    await businessProduct.save();

    businessBrand.productCount = businessBrand.productCount + 1;
    await businessBrand.save();

    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

module.exports = createProduct;
