// const LogService = require("../../services/log.service");
const string_to_slug = require("../../helpers/string_to_slug");
const Comparison = require("../../models/comparison.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const vsBulkJsonService = require("../../services/elasticSearch/vsBulkJson.service");

const create = async (req, res, next) => {
  try {
    const response = [];
    if (Array.isArray(req.body.vs)) {
      for await (const v of req.body.vs) {
        const exists = await Comparison.findOne({
          $or: [
            { compare1Id: v.first._id, compare2Id: v.second._id },
            { compare2Id: v.first._id, compare1Id: v.second._id },
          ],
        })
          .populate("compare1Id")
          .populate("compare2Id");

        if (!exists) {
          const comparison = new Comparison({
            compare1Id: v.first._id,
            compare2Id: v.second._id,
            onModel: req.body.onModel,
            categoryId: req.body.categoryId,
          });

          if (req.body.onModel === "brand") {
            comparison.slug = v.first.slug + "-vs-" + v.second.slug;
          } else if (req.body.onModel === "product") {
            comparison.slug =
              string_to_slug(v.first.title) +
              "-vs-" +
              string_to_slug(v.second.title);
          }

          await comparison.save();

          await elasticsearchService.put("comparisons", {
            _id: comparison._id,
            compare1Id: v.first.title,
            compare2Id: v.second.title,
            slug: comparison.slug,
            type: comparison.onModel,
          });

          const comparison2 = { ...comparison.toObject() };
          comparison2.compare1Id = { _id: v.first._id, title: v.first.title };
          comparison2.compare2Id = { _id: v.second._id, title: v.second.title };
          response.push(comparison2);
        } else {
          response.push(exists);
        }
      }
    }

    await vsBulkJsonService();

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
