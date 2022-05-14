const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const Comparison = require("../../models/comparison.model");
const Review = require("../../models/review.model");
const Redirect = require("../../models/redirect.model");
const Banner = require("../../models/banner.model");

const productDetail = async (req, res, next) => {
  try {
    const redirect = await Redirect.findOne({
      oldAddress: req.params.catSlug + "/" + req.params.proSlug,
    });
    if (redirect) {
      return res.status(200).json({
        redirect: redirect,
      });
    }

    const product = await Product.findOne({
      slug: req.params.catSlug + "/" + req.params.proSlug,
      active: true,
      published: true,
    })
      .populate({
        path: "categoryId",
        populate: {
          path: "bannerId",
        },
      })
      .populate("brandId")
      .populate("tagIds")
      .lean();

    if (!product) {
      res.status(200).json({
        product: null,
        levelTwoCategory: null,
        levelThreeCategory: null,
        comparisons: null,
        reviews: null,
        reviewsCount: 0,
      });
    }

    if (product?.categoryId && !product?.categoryId?.bannerId) {
      const banner = await Banner.findOne({
        selected: true,
        productExceptions: { $elemMatch: { $eq: product._id } },
      });

      if (banner) {
        product.categoryId = { ...product.categoryId, bannerId: banner };
      }
    }

    const levelThreeCategoryAxios = Category.findOne({
      _id: product?.categoryId,
      published: true,
    }).populate({
      path: "products._id",
      match: { published: true },
    });

    const levelTwoCategoryAxios = Category.findOne({
      _id: product?.categoryId?.parentId,
      published: true,
    })
      .populate("parentId")
      .populate({
        path: "brands._id",
        match: { published: true },
      });

    const comparisonsAxios = Comparison.find({
      $or: [{ compare1Id: product._id }, { compare2Id: product._id }],
    })
      .populate({
        path: "compare1Id",
        match: { published: true, "attributes.1": { $exists: true } },
        populate: {
          path: "brandId",
        },
      })
      .populate({
        path: "compare2Id",
        match: { published: true, "attributes.1": { $exists: true } },
        populate: {
          path: "brandId",
        },
      });

    const reviewsAxios = Review.find({
      onModal: "product",
      modelId: product._id,
      status: "accepted",
    })
      .sort({ depth: 1, createdAt: -1 })
      .lean();

    const [levelTwoCategory, levelThreeCategory, comparisons, reviews] =
      await Promise.all([
        levelTwoCategoryAxios,
        levelThreeCategoryAxios,
        comparisonsAxios,
        reviewsAxios,
      ]);

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

    const filteredComparisons = comparisons.filter((element) => {
      if (element.compare1Id?.title && element.compare2Id?.title) {
        return true;
      } else {
        return false;
      }
    });

    let hasReview;

    if (req.user) {
      hasReview = await Review.findOne({
        onModal: "product",
        modelId: product._id,
        userId: req.user._id,
      });
    }

    res.status(200).json({
      product: product,
      levelTwoCategory: levelTwoCategory,
      levelThreeCategory: levelThreeCategory,
      comparisons: filteredComparisons,
      reviews: threads.slice(0, 200),
      hasReview: hasReview?._id,
      reviewsCount: product?.reviewsCount,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = productDetail;
