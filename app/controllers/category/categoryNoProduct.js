const Category = require("../../models/category.model");

const categoryNoProduct = async (req, res) => {
  const category = await Category.aggregate([
    {
      $match: {
        type: "category",
        level: { $ne: 1 },
      },
    },
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
      $lookup: {
        from: "brands",
        foreignField: "categories._id",
        localField: "_id",
        as: "band",
        pipeline: [{ $project: { title: 1 } }],
      },
    },
    {
      $match: {
        poduct: { $size: 0 },
        band: { $size: 0 },
      },
    },
    { $project: { title: 1, level: 1, poduct: 1, band: 1, products: 1 } },
  ]);

  const catIdArray = category.map((el) => {
    return el._id;
  });

  res.status(200).json(catIdArray);
};

module.exports = categoryNoProduct;
