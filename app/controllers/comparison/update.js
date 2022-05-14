const Comparison = require("../../models/comparison.model");
const elasticsearchService = require("../../services/elasticsearch.service");
const LogService = require("../../services/log.service");

const update = async (req, res, next) => {
  try {
    const comparison = await Comparison.findById(req.params._id)
      .populate("compare1Id")
      .populate("compare2Id");

    comparison.titleSeo = req.body.titleSeo;
    comparison.descriptionSeo = req.body.descriptionSeo;
    comparison.slug = req.body.slug;
    comparison.winnerId = req.body.winner;
    comparison.descriptionShort = req.body.descriptionShort;
    comparison.showHomePage = req.body.showHomePage;

    if (
      req.body.winner &&
      req.body.winner?.toString() === comparison.compare2Id?.toString()
    ) {
      const tempWinner = comparison.compare2Id;
      comparison.compare2Id = comparison.compare1Id;
      comparison.compare1Id = tempWinner;
    }

    await comparison.save();

    try {
      await elasticsearchService.updateField("comparisons", {
        _id: comparison._id,
        slug: comparison.slug,
      });
    } catch (err) {
      console.log(err);
    }

    await LogService.create({
      model: "comparison",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: comparison._id,
      userId: req.user._id,
    });

    res.status(200).json({ message: "successful." });
  } catch (err) {
    next(err);
  }
};

module.exports = update;
