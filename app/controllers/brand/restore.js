const Brand = require("../../models/brand.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const remove = async (req, res, next) => {
  try {
    const brand = await Brand.findOneDeleted({ _id: req.params._id });

    await LogService.create({
      model: "brand",
      url: req.originalUrl,
      method: req.method,
      data: brand,
      modelId: brand._id,
      userId: req.user._id,
    });

    await brand.restore();

    if (brand.published && brand.active) {
      const body = {
        _id: brand._id,
        title: brand.title,
        slug: brand.slug,
        searchTags: brand.searchTags,
      };

      if (brand?.image?.fileName) {
        body.image = "files/images/small/" + brand?.image?.fileName;
      }

      await elasticsearchService.put("brands", body);
    }

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
