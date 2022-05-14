const Coupon = require("../../models/coupon.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOneDeleted({
      _id: req.params._id,
    }).populate("modelId");

    await LogService.create({
      model: "coupon",
      url: req.originalUrl,
      method: req.method,
      data: coupon,
      modelId: coupon._id,
      userId: req.user._id,
    });

    await coupon.restore();

    await elasticsearchService.put("coupons", {
      _id: coupon._id,
      title: coupon.title,
      model: coupon.modelId.title,
      onModel: coupon.onModel,
    });

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
