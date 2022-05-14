const Category = require("../../models/category.model");
const firstPage = async (req, res, next) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          deleted: false,
          type: "category",
          level: 1,
          published: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentId",
          as: "childs",
          pipeline: [{ $match: { deleted: false }, published: true }],
        },
      },
      { $unwind: "$childs" },
      {
        $lookup: {
          from: "categories",
          localField: "childs._id",
          foreignField: "parentId",
          as: "childs.childs",
          pipeline: [{ $match: { deleted: false }, published: true }],
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          slug: { $first: "$slug" },
          childs: { $push: "$childs" },
        },
      },
    ]);

    res.status(200).json({
      categories: categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = firstPage;
