const Coupon = require("../../models/coupon.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const LogService = require("../../services/log.service");

const update = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params._id);

    coupon.title = req.body.title;
    coupon.amount = req.body.amount;
    coupon.occasion = req.body.occasion;
    coupon.code = req.body.code;
    coupon.expireDate = req.body.expireDate;
    coupon.showHomePage = req.body.showHomePage;

    await coupon.save();

    await LogService.create({
      model: "coupon",
      url: req.originalUrl,
      method: req.method,
      data: coupon,
      modelId: coupon._id,
      userId: req.user._id,
    });

    await elasticsearchService.put("coupons", {
      _id: coupon._id,
      title: coupon.title,
      model: coupon.modelTitle,
      onModel: coupon.onModel,
    });

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
