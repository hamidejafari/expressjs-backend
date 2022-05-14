const Brand = require("../../models/brand.model");
const Comparison = require("../../models/comparison.model");

const categoryVsBrand = async (req, res, next) => {
  try {
    const brands = await Brand.find({}).sort("-createdAt");

    const comparisons = await Comparison.find({
      categoryId: req.params._id,
      onModel: "brand",
    });

    const selectedBrand = [];

    comparisons.forEach((comparison) => {
      selectedBrand.push(comparison.compare1Id.toString());
      selectedBrand.push(comparison.compare2Id.toString());
    });

    const uniqSelectedBrand = [...new Set(selectedBrand)];

    res.status(200).json({ brands, selectedBrands: uniqSelectedBrand });
  } catch (err) {
    next(err);
  }
};

module.exports = categoryVsBrand;
