const Comparison = require("../../models/comparison.model");

const adminAllGrouped = async (req, res, next) => {
  const perPage = +req.query.perPage || 10;
  const page = +req.query.page - 1 || 0;

  try {
    const query = { deleted: false, onModel: "product" };

    if (req.query.showHomePage) {
      query.showHomePage = true;
      const comparisons = await Comparison.find(query)
        .skip(page * perPage)
        .limit(perPage)
        .sort("-createdAt")
        .populate("categoryId")
        .populate("compare1Id")
        .populate("compare2Id");

      const count = await Comparison.find(query).count();
      const lastPage = Math.ceil(count / perPage);

      return res.status(200).json({ data: comparisons, meta: { count, lastPage } });
    }

    // const categories = await Comparison.find(query)
    //   .skip(page * perPage)
    //   .limit(perPage)
    //   .sort("-createdAt")
    //   .populate("compare1Id")
    //   .populate("compare2Id");

    const categories = await Comparison.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "products",
          localField: "compare1Id",
          foreignField: "_id",
          as: "compare1Id",
          pipeline: [
            { $match: { deleted: false } },
            { $project: { title: 1, brandId: 1 } },
          ],
        },
      },
      {
        $unwind: "$compare1Id",
      },
      {
        $lookup: {
          from: "products",
          localField: "compare2Id",
          foreignField: "_id",
          as: "compare2Id",
          pipeline: [
            { $match: { deleted: false } },
            { $project: { title: 1, brandId: 1 } },
          ],
        },
      },
      {
        $unwind: "$compare2Id",
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
          pipeline: [
            { $match: { deleted: false } },
            { $project: { title: 1 } },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$categoryId",
          compares: {
            $push: {
              _id: "$_id",
              compare1Id: "$compare1Id",
              compare2Id: "$compare2Id",
              onModel: "$onModel",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              categoryId: "$categoryId",
              category: "$category",
              compare1Product: "$compare1Product",
              compare1Brand: "$compare1Brand",
              compare2Product: "$compare2Product",
              compare2Brand: "$compare2Brand",
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      {
        $facet: {
          meta: [{ $count: "count" }],
          data: [{ $skip: page * perPage }, { $limit: perPage }],
        },
      },
    ]);

    if (categories[0] && categories[0].meta[0]) {
      categories[0].meta = {
        count: categories[0].meta[0].count,
        lastPage: Math.ceil(categories[0].meta[0].count / perPage),
      };
    }

    res.status(200).json(categories[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = adminAllGrouped;
