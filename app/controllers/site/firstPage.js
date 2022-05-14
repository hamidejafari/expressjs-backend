const Category = require("../../models/category.model");
const Comparison = require("../../models/comparison.model");
const Review = require("../../models/review.model");
const Coupon = require("../../models/coupon.model");

const firstPage = async (req, res, next) => {
  try {
    const mainCategories = await Category.find({
      type: "category",
      level: 1,
      published: true,
    })
      .select({ title: 1, slug: 1, icon: 1 })
      .limit(7)
      .sort("title");
    const bestCategories = await Category.find({
      type: "category",
      level: 3,
      showHomePage: true,
      published: true,
      active: true,
    })
      .select({ title: 1, slug: 1, icon: 1 })
      .limit(6)
      .sort("title");
    const comparisons = await Comparison.find({
      showHomePage: true,
      onModel: "product",
    })
      .limit(3)
      .populate({
        path: "compare1Id",
        select: "title brandId",
        populate: {
          path: "brandId",
          select: "title image",
        },
      })
      .populate({
        path: "compare2Id",
        select: "title brandId",
        populate: {
          path: "brandId",
          select: "title image",
        },
      });

    const reviews = await Review.find({
      status: "accepted",
      onModel: "product",
      showHomePage: true,
    }).populate("modelId");

    let reviewsArr = [];

    reviews.forEach((element, index) => {
      if (index % 2 === 0) {
        reviewsArr[index] = [];
        reviewsArr[index].push(element);
      } else {
        reviewsArr[index - 1].push(element);
      }
    });

    const coupons = await Coupon.find({ showHomePage: true })
      .limit(3)
      .populate("modelId");

    res.status(200).json({
      mainCategories: mainCategories,
      bestCategories: bestCategories,
      comparisons: comparisons,
      reviews: reviewsArr,
      coupons: coupons,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = firstPage;
