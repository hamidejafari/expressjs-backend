const Product = require("../../models/product.model");
const LogService = require("../../services/log.service");

const editStar = async (req, res, next) => {
  try {
    const stars = req.body.stars;

    for await (const star of stars) {
      const pr = await Product.findById(star[0]);
      pr.star = star[1];
      await pr.save();
    }

    await LogService.create({
      model: "product",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      userId: req.user._id,
    });

    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

module.exports = editStar;
