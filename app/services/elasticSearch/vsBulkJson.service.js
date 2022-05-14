const Comparison = require("../../models/comparison.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const vsBulkJsonService = () => {
  return new Promise((resolve) => {
    if (process.env.ENVIRONMENT === "development") {
      return resolve();
    }
    const af = async () => {
      const comparisons = await Comparison.find({})
        .populate({
          path: "compare1Id",
          match: {
            "attributes.1": { $exists: true },
            active: true,
            published: true,
          },
        })
        .populate({
          path: "compare2Id",
          match: {
            "attributes.1": { $exists: true },
            active: true,
            published: true,
          },
        });

      for await (const comparison of comparisons) {
        if (comparison?.compare1Id?._id && comparison?.compare2Id?._id) {
          await elasticsearchService.put("comparisons", {
            _id: comparison._id,
            compare1Id: comparison.compare1Id.title,
            compare2Id: comparison.compare2Id.title,
            slug: comparison.slug,
            type: comparison.onModel,
          });
        }
      }

      resolve("done");
    };

    af();
  });
};

module.exports = vsBulkJsonService;
