const Tag = require("../../models/tag.model");
// const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const update = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params._id);

    tag.title = req.body.title;
    tag.titleSeo = req.body.titleSeo;
    tag.description = req.body.description;
    tag.descriptionSeo = req.body.descriptionSeo;
    tag.published = req.body.published;
    tag.noIndex = req.body.noIndex;
    tag.categoryId = req.body.categoryId;
    if (req.body.publishDate) {
      tag.publishDate = req.body.publishDate;
    }

    await tag.save();

    // if (tag.published && tag.active) {
    //   const body = {
    //     _id: tag._id,
    //     title: tag.title,
    //     slug: tag.slug,
    //     searchTags: tag.searchTags,
    //   };

    //   if (tag?.image?.fileName) {
    //     body.image = "files/images/small/" + tag?.image?.fileName;
    //   }

    //   await elasticsearchService.put("tags", body);
    // } else {
    //   await elasticsearchService.delete("tags", tag._id);
    // }

    await LogService.create({
      model: "tag",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: tag._id,
      userId: req.user._id,
    });

    res.status(200).json(tag);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
