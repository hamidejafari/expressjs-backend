const UploadService = require("../../services/upload.service");
const BusinessProduct = require("../../models/businessProduct.model");

const updateProduct = async (req, res, next) => {
  try {
    const product = await BusinessProduct.findById(req.params._id);

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

    product.title = req.body.title;
    product.description = req.body.description;
    product.faq = req.body.faq;
    product.pros = req.body.pros;
    product.cons = req.body.cons;
    product.categoryId = req.body.categoryId;
    product.status = "pending";
    product.image = req.body.image || product.image;

    await product.save();

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = updateProduct;
