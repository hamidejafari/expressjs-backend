const Brand = require("../../models/brand.model");

const addAttribute = async (req, res, next) => {
  try {
    // const brand = await Brand.findOne({ _id: req.params._id });

    const attributes = req.body.attributes;

    const ids = [];

    for (const variable in attributes) {
      ids.push(variable);
    }

    const brands = await Brand.find({ _id: { $in: ids } });

    for await (const brand of brands) {
      brand.attributes = attributes[brand._id.toString()];
      await brand.save();
    }

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = addAttribute;
