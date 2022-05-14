const Coupon = require("../../models/coupon.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const couponBulkJson = async (req, res) => {
  const coupons = await Coupon.find({}).populate("modelId");

  for await (const coupon of coupons) {
    await elasticsearchService.put("coupons", {
      _id: coupon._id,
      title: coupon.title,
      model: coupon.modelId.title,
      onModel: coupon.onModel,
    });
  }

  res.send("done");
};

module.exports = couponBulkJson;
