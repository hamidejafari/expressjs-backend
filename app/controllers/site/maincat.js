const Category = require("../../models/category.model");

const maincat = async (req, res, next) => {
  try {
    const category = await Category.aggregate([
      {
        $match: {
          deleted: false,
          type: "category",
          level: { $ne: 3 },
          published: true,
          active: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentId",
          as: "childs",
          pipeline: [
            {
              $match: {
                deleted: false,
                "products.1": { $exists: true },
                published: true,
                active: true,
              },
            },
            {
              $project: {
                title:1,
                slug:1,
                level:1,
                icon:1,
              }
            }
          ],
        },
      },
      {
        $group: {
          _id: "$level",
          data: {
            $push: {
              _id: "$_id",
              title: "$title",
              slug: "$slug",
              level: "$level",
              icon: "$icon",
              childs: "$childs",
              parentId: "$parentId",
            },
          },
        },
      },
    ]);

    // const level2catIndex = category.findIndex((cat) => {
    //   return cat._id === 2;
    // });

    // let filtered = category[level2catIndex].data.filter((value) => {
    //   return value.childs.length > 0;
    // });

    // category[level2catIndex].data = filtered;

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = maincat;
