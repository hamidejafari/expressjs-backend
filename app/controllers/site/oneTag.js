const Product = require("../../models/product.model");
const Tag = require("../../models/tag.model");
const Category = require("../../models/category.model");

const brandDetail = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({
      slug: req.params.slug,
      published: true,
    }).populate();

    if (!tag) {
      return res.status(404).json();
    }

    const products = await Product.find({
      tagIds: { $elemMatch: { $eq: tag._id } },
    }).select(
      "brandId title images image star reviewsCount star siteUrl slug descriptionBest faq pros cons"
    );

    const category = await Category.findOne({
      _id: tag.categoryId,
    }).populate({
      path: "brands._id",
      match: { published: true, active: true },
    });

    res.status(200).json({
      category,
      products,
      tag,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = brandDetail;
