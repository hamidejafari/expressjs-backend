const Brand = require("../../models/brand.model");
const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
const Redirect = require("../../models/redirect.model");
const Category = require("../../models/category.model");
const Banner = require("../../models/banner.model");

const brandDetail = async (req, res, next) => {
  try {
    const redirect = await Redirect.findOne({
      oldAddress: "brand/" + req.params.slug,
    });
    if (redirect) {
      return res.status(200).json({
        redirect: redirect,
      });
    }

    const brand = await Brand.findOne({
      slug: req.params.slug,
      published: true,
    }).populate({
      path: "categories._id",
      match: { published: true },
    });

    if (!brand) {
      return res.json();
    }

    const products = await Product.find({
      brandId: brand._id,
      published: true,
      active: true,
    })
      .select("title slug image images star reviewsCount")
      .populate("categoryId", "title slug");

    const reviews = await Review.find({
      onModal: "brand",
      modelId: brand._id,
      status: "accepted",
    })
      .sort({ depth: 1, createdAt: -1 })
      .lean();

    const rec = (comment, threads) => {
      for (var thread of threads) {
        if (thread._id.toString() === comment.parentId.toString()) {
          thread.children.push(comment);
          return;
        }

        if (thread.children) {
          rec(comment, thread.children);
        }
      }
    };
    let threads = [],
      comment;
    for (let i = 0; i < reviews.length; i++) {
      comment = reviews[i];
      comment["children"] = [];
      let parentId = comment.parentId;
      if (!parentId) {
        threads.push(comment);
        continue;
      }
      rec(comment, threads);
    }

    const mainCategory = await Category.findOne({
      _id: brand?.categories[0]?._id,
      published: true,
    })
      .populate("brands._id")
      .populate("bannerId")
      .lean();

    if (mainCategory && !mainCategory.bannerId) {
      const banner = await Banner.findOne({
        selected: true,
        brandExceptions: { $elemMatch: { $eq: brand._id } },
      });

      if (banner) {
        mainCategory.bannerId = banner;
      }
    }

    let hasReview;

    if (req.user) {
      hasReview = await Review.findOne({
        onModal: "brand",
        modelId: brand._id,
        userId: req.user._id,
      });
    }

    res.status(200).json({
      brand: brand,
      products: products,
      reviews: threads.slice(0,200),
      hasReview: hasReview?._id,
      reviewsCount: brand?.reviewsCount,
      mainCategory: mainCategory,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = brandDetail;
