const Brand = require("../../models/brand.model");

const brand = async (req, res, next) => {
  try {
    const brands = await Brand.find({ published: true })
      .select("title slug")
      .sort({ title: 1 });

    res.status(200).json(brands);
  } catch (err) {
    next(err);
  }
};

module.exports = brand;
