const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
// const Brand = require("../../models/brand.model");
const Redirect = require("../../models/redirect.model");

const categoryDetail = async (req, res, next) => {
  try {
    if (req?.query?.ab && req.params._id !== "best-butt-enhancers") {
      res.status(200).json({
        category: null,
      });
    } else if (req?.query?.ab && req.params._id == "best-butt-enhancers") {
      const category = await Category.findOne({
        type: "category",
        slug: req.params._id,
        published: true,
        active: true,
      })
        .populate("parentId")
        .populate("bannerId")
        .populate({
          path: "brands._id",
          match: { published: true, active: true },
        })
        .populate({
          path: "parentId.brands._id",
          match: { published: true, active: true },
        });

      let topChilds = [];
      let catBrands = [];
      let catParent = null;
      let extraProducts = [];

      topChilds = await Category.find({
        type: "category",
        published: true,
        parentId: category.parentId._id,
        _id: { $ne: category._id },
        active: true,
      }).select("title icon slug");
      const test = await Category.findOne({
        _id: category.parentId._id,
        published: true,
      }).populate({
        path: "brands._id",
        match: { published: true },
      });
      catBrands = test?.brands;
      catParent = await Category.findOne({
        _id: category.parentId._id,
        published: true,
      }).populate("parentId");

      const products = [];
      for await (const item of category.products) {
        products.push({
          standing: item.standing,
          product: await Product.findById(item._id)
            .populate("brandId")
            .select(
              "brandId title images image star reviewsCount star siteUrl slug descriptionBest faq pros cons"
            ),
        });
      }


      const productStanding = category.products.map((pro) => {
        if (pro?._id) {
          return pro?._id;
        }
      });


      extraProducts = await Product.find({
        _id: { $nin: productStanding },
        categoryId: category._id,
      }).select("title image slug");

      return res.status(200).json({
        category: category,
        productsRating: products,
        topChilds,
        catBrands,
        catParent,
        extraProducts: extraProducts,
      });

    }

    const redirect = await Redirect.findOne({
      $or: [
        { oldAddress: req.params._id },
        { oldAddress: "/" + req.params._id },
      ],
    });

    if (redirect) {
      return res.status(200).json({
        redirect: redirect,
      });
    }

    const category = await Category.findOne({
      type: "category",
      slug: req.params._id,
      published: true,
      active: true,
    })
      .populate("parentId")
      .populate("bannerId")
      .populate({
        path: "brands._id",
        match: { published: true, active: true },
      })
      .populate({
        path: "parentId.brands._id",
        match: { published: true, active: true },
      })
      .populate({
        path: "products._id",
        match: { published: true, active: true },
      });

    let topChilds = [];
    let catBrands = [];
    let extraProducts = [];
    let catParent = null;

    if (category && category.level === 3) {
      topChilds = await Category.find({
        type: "category",
        published: true,
        parentId: category.parentId._id,
        _id: { $ne: category._id },
        active: true,
      }).select("title icon slug");
      const test = await Category.findOne({
        _id: category.parentId._id,
        published: true,
      }).populate({
        path: "brands._id",
        match: { published: true },
      });
      catBrands = test?.brands;
      catParent = await Category.findOne({
        _id: category.parentId._id,
        published: true,
      }).populate("parentId");

      const productStanding = category.products.map((pro) => {
        if (pro?._id?._id) {
          return pro?._id?._id;
        }
      });

      extraProducts = await Product.find({
        _id: { $nin: productStanding },
        categoryId: category._id,
      }).select("title image slug");
    }

    if (category && category.level === 2) {
      const test = await Category.findOne({
        _id: category.parentId._id,
        published: true,
      }).populate("brands._id");
      catBrands = test?.brands;
      topChilds = await Category.find({
        parentId: category._id,
        published: true,
        active: true,
      }).select("title icon slug shortDescription");

      if (!topChilds || !Array.isArray(topChilds) || topChilds.length === 0) {
        return res.status(200).json({});
      }
    }

    if (category && category.level === 1) {
      topChilds = await Category.find({
        parentId: category._id,
        published: true,
        active: true,
      }).select("title icon slug shortDescription");
    }

    res.status(200).json({
      category: category,
      topChilds,
      catBrands,
      catParent,
      extraProducts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = categoryDetail;
