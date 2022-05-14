const BusinessBrand = require("../../models/businessBrand.model");
const BusinessProduct = require("../../models/businessProduct.model");

const products = async (req, res, next) => {
  try {
    let products = [];
    const businessBrand = await BusinessBrand.findOne({userId:req.user._id});
    if(businessBrand){
        products = await BusinessProduct.find({businessBrandId:businessBrand._id});
    }
    res.status(200).json({
        products: products
    });
  } catch (err) {
    next(err);
  }
};

module.exports = products;