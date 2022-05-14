const Tag = require("../../models/tag.model");
// const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const create = async (req, res, next) => {
  try {
    const tag = new Tag({
      title: req.body.title,
      titleSeo: req.body.titleSeo,
      description: req.body.description,
      descriptionSeo: req.body.descriptionSeo,
      published: req.body.published,
      noIndex: req.body.noIndex,
      h1: req.body.h1,
      slug: req.body.slug,
      categoryId: req.body.categoryId,
    });

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

module.exports = create;
