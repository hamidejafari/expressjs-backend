const Comparison = require("../../models/comparison.model");
const Product = require("../../models/product.model");
const Redirect = require("../../models/redirect.model");

const getOneComparisons = async (req, res, next) => {
  try {
    const type = await Comparison.findOne({
      slug: req.params.slug,
    });
    let comparison;
    if (type?.onModel === "product") {
      comparison = await Comparison.findOne({
        slug: req.params.slug,
      })
        .populate("categoryId", "title attributes")
        .populate({
          path: "compare1Id",
          match: { "attributes.1": { $exists: true } },
          select: {
            title: 1,
            slug: 1,
            star: 1,
            siteUrl: 1,
            pros: 1,
            cons: 1,
            image: 1,
            attributes: 1,
            reviewsCount: 1,
          },
          populate: {
            path: "brandId",
            select: {
              title: 1,
              slug: 1,
              star: 1,
              siteUrl: 1,
              image: 1,
              reviewsCount: 1,
              attributes: 1,
              flag: 1,
            },
          },
        })
        .populate({
          path: "compare2Id",
          match: { "attributes.1": { $exists: true } },
          select: {
            title: 1,
            slug: 1,
            star: 1,
            siteUrl: 1,
            pros: 1,
            cons: 1,
            image: 1,
            attributes: 1,
            reviewsCount: 1,
          },
          populate: {
            path: "brandId",
            select: {
              title: 1,
              slug: 1,
              star: 1,
              siteUrl: 1,
              image: 1,
              reviewsCount: 1,
              attributes: 1,
              flag: 1,
            },
          },
        })
        .lean();

      const brand1productCount = await Product.find({
        brandId: comparison?.compare1Id?.brandId?._id,
      }).count();
      const brand2productCount = await Product.find({
        brandId: comparison?.compare2Id?.brandId?._id,
      }).count();

      if (comparison?.compare1Id?.brandId) {
        comparison.compare1Id.brandId.productCount = brand1productCount;
      }

      if (comparison?.compare2Id?.brandId) {
        comparison.compare2Id.brandId.productCount = brand2productCount;
      }
    } else {
      comparison = await Comparison.findOne({
        slug: req.params.slug,
      })
        .populate("categoryId", "title attributes")
        .populate({
          path: "compare1Id",
          match: { "attributes.1": { $exists: true } },
          select: {
            title: 1,
            slug: 1,
            star: 1,
            siteUrl: 1,
            pros: 1,
            cons: 1,
            image: 1,
            reviewsCount: 1,
            attributes: 1,
            flag: 1,
          },
        })
        .populate({
          path: "compare2Id",
          match: { "attributes.1": { $exists: true } },
          select: {
            title: 1,
            slug: 1,
            star: 1,
            siteUrl: 1,
            pros: 1,
            cons: 1,
            image: 1,
            reviewsCount: 1,
            attributes: 1,
            flag: 1,
          },
        })
        .lean();
    }

    if (!comparison?.compare1Id?._id || !comparison?.compare1Id?._id) {
      let redirect;
      redirect = await Redirect.findOne({
        oldAddress: req.params.slug,
      });
      if (redirect) {
        return res.status(200).json({
          redirect: redirect,
        });
      }

      return res.status(404).send({});
    }

    if (
      comparison.winnerId &&
      comparison.winnerId === comparison.compare2Id?._id
    ) {
      const tempWinner = { ...comparison.compare2Id };
      comparison.compare2Id = comparison.compare1Id;
      comparison.compare1Id = tempWinner;
    }

    const related = await Comparison.find({
      $or: [
        { compare1Id: comparison.compare1Id._id },
        { compare2Id: comparison.compare1Id._id },
      ],
    })
      .populate({
        path: "compare1Id",
        match: { "attributes.1": { $exists: true } },
      })
      .populate({
        path: "compare2Id",
        match: { "attributes.1": { $exists: true } },
      });

    const filteredRelated = related.filter((relate) => {
      let isDual = true;
      if (
        relate?.compare1Id?._id.toString() ===
          comparison.compare1Id._id.toString() &&
        relate?.compare2Id?._id.toString() ===
          comparison.compare2Id._id.toString()
      ) {
        isDual = false;
      }
      return relate.compare1Id && relate.compare2Id && isDual;
    });

    res.status(200).json({ comparison, related: filteredRelated });
  } catch (err) {
    next(err);
  }
};

module.exports = getOneComparisons;
