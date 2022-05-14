const Brand = require("../../models/brand.model");

const adminSelectBox = async (req, res, next) => {
  try {
    const brands = await Brand.find({
      categories: { $elemMatch: { _id: { $in: req.categoryIds } } },
    })
      .select({ title: 1 })
      .sort("title");

    res.status(200).json({ data: brands });
  } catch (err) {
    next(err);
  }
};

module.exports = adminSelectBox;
