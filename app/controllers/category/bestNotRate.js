const Category = require("../../models/category.model");

const bestNotRate = async (req, res) => {
  const category = await Category.aggregate([
    { $match: { level: 3 } },
    {
      $lookup: {
        from: "products",
        foreignField: "categoryId",
        localField: "_id",
        as: "poduct",
        pipeline: [{ $project: { title: 1 } }],
      },
    },
    {
      $match: { "brands.1": { $exists: true }, products: { $size: 0 } },
    },
    { $project: { title: 1, level: 1, poduct: 1, products: 1 } },
  ]);
  res.status(200).json(category);
};

module.exports = bestNotRate;
