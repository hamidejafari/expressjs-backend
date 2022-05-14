const User = require("../../models/user.model");
const Brand = require("../../models/brand.model");
const BusinessBrand = require("../../models/businessBrand.model");
const Product = require("../../models/product.model");
const BusinessProduct = require("../../models/businessProduct.model");
const sanitizeHtml = require("sanitize-html");

const confirm = async (req, res, next) => {
  try {
    let user;
    let token;

    user = await User.findOne({ email: req.body.email });

    if (req.body.code === user.confirmCode) {
      token = user.generateToken();
    } else {
      res
        .status(400)
        .json({ error: { code: ["Confirm code is not correct."] } });
    }

    const brand = await Brand.findOne({
      siteUrl: { $regex: user?.website, $options: "i" },
    });
    if (brand) {
      const products = Product.find({ brandId: brand._id });

      const brandPros = brand.pros?.map((pro) =>
        sanitizeHtml(pro, {
          allowedTags: [],
        })
      );

      const brandCons = brand.cons?.map((con) =>
        sanitizeHtml(con, {
          allowedTags: [],
        })
      );

      let brandDesc = "";

      brand.description.forEach((description) => {
        brandDesc += description.header + "\n";
        brandDesc +=
          sanitizeHtml(description.desc, {
            allowedTags: [],
          }) + "\n";
      });

      const existingBrand = new BusinessBrand({
        title: brand.title,
        descriptionShort: brandDesc,
        image: brand.image?.fileName,
        siteUrl: brand.siteUrl,
        youtubeVideoLink: brand.youtubeVideoLink,
        faq: brand.faq,
        pros: brandPros,
        cons: brandCons,
        userId: user._id,
        brandId: brand._id,
        status: "created by brandsreviews",
      });
      await existingBrand.save();

      for await (const pro of products) {
        let images = [];
        pro.images?.forEach((image) => {
          images.push(image?.fileName);
        });

        let beforeAfters = [];
        pro.beforeAfters?.forEach((image) => {
          beforeAfters.push(image?.fileName);
        });

        const productPros = pro.pros?.map((pr) =>
          sanitizeHtml(pr, {
            allowedTags: [],
          })
        );

        const productCons = pro.cons?.map((co) =>
          sanitizeHtml(co, {
            allowedTags: [],
          })
        );

        let proDesc = "";

        pro.description.forEach((description) => {
          proDesc += description.header + "\n";
          proDesc +=
            sanitizeHtml(description.desc, {
              allowedTags: [],
            }) + "\n";
        });

        const existingProduct = new BusinessProduct({
          title: pro.title,
          image: pro.image?.fileName,
          description: proDesc,
          images: images,
          beforeAfters: beforeAfters,
          faq: pro.faq,
          pros: productPros,
          cons: productCons,
          youtubeVideoLink: pro.youtubeVideoLink,
          categoryId: pro.categoryId,
          productId: pro._id,
          userId: user._id,
          businessBrandId: existingBrand._id,
          status: "created by brandsreviews",
        });
        await existingProduct.save();
      }
    } else {
      const newBrand = new BusinessBrand({
        siteUrl: user.website,
        userId: user._id,
        status: "accepted",
        title: user.companyName,
      });
      await newBrand.save();
    }

    res.status(200).json({ status: "success", token: token });
  } catch (err) {
    next(err);
  }
};

module.exports = confirm;
