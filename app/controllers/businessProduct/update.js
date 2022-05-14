const BusinessProduct = require("../../models/businessProduct.model");
const Product = require("../../models/product.model");

const update = async (req, res, next) => {
  try {
    const businessProduct = await BusinessProduct.findById(req.params._id);
    if (!businessProduct.productId) {
      let images = [];
      businessProduct.images?.forEach((image) => {
        images.push({ fileName: image, alt: businessProduct.title });
      });

      let beforeAfters = [];
      businessProduct.beforeAfters?.forEach((image) => {
        beforeAfters.push({ fileName: image, alt: businessProduct.title });
      });

      const product = new Product({
        title: businessProduct.title,
        image: { fileName: businessProduct.image, alt: businessProduct.title },
        descriptionShort: businessProduct.description,
        images: images,
        beforeAfters: beforeAfters,
        faq: businessProduct.faq,
        pros: businessProduct.pros,
        cons: businessProduct.cons,
        youtubeVideoLink: businessProduct.youtubeVideoLink,
        categoryId: businessProduct.categoryId,
      });
      await product.save();
      businessProduct.productId = product._id;
    } else {
      let images = [];
      businessProduct.images?.forEach((image) => {
        images.push({ fileName: image, alt: businessProduct.title });
      });
      let beforeAfters = [];
      businessProduct.beforeAfters?.forEach((image) => {
        beforeAfters.push({ fileName: image, alt: businessProduct.title });
      });
      const product = Product.findById(businessProduct.productId);
      product.title = businessProduct.title;
      product.image = {
        fileName: businessProduct.image,
        alt: businessProduct.title,
      };
      product.descriptionShort = businessProduct.description;
      product.images = images;
      product.beforeAfters = beforeAfters;
      product.faq = businessProduct.faq;
      product.pros = businessProduct.pros;
      product.cons = businessProduct.cons;
      product.youtubeVideoLink = businessProduct.youtubeVideoLink;
      product.categoryId = businessProduct.categoryId;
      await product.save();
    }
    businessProduct.status = req.body.status;
    await businessProduct.save();
    res.status(200).json(businessProduct);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
