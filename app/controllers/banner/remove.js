const Banner = require("../../models/banner.model");
const Category = require("../../models/category.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params._id).populate("modelId");

    const categoryParent = await Category.findById(banner.modelId?.parentId);

    if (categoryParent?.bannerId) {
      await Category.updateMany(
        {
          bannerId: req.params._id,
        },
        { $set: { bannerId: categoryParent?.bannerId } }
      );
    } else {
      await Category.updateMany(
        {
          bannerId: req.params._id,
        },
        { $unset: { bannerId: "" } }
      );
    }

    await LogService.create({
      model: "banner",
      url: req.originalUrl,
      method: req.method,
      data: banner,
      modelId: banner._id,
      userId: req.user._id,
    });

    await elasticsearchService.delete("banners", banner._id);

    await banner.delete();

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
