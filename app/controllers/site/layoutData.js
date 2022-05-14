const Setting = require("../../models/setting.model");
const Category = require("../../models/category.model");

const layoutData = async (req, res, next) => {
  try {
    const setting = await Setting.findOne().sort("-created_at");

    const categories = await Category.aggregate([
      {
        $match: {
          type: "category",
          level: 1,
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
            { $match: { deleted: false, published: true, active: true } },
            { $project: { title: 1, slug: 1, createdAt: 1 } },
          ],
        },
      },
      { $unwind: "$childs" },
      {
        $lookup: {
          from: "categories",
          localField: "childs._id",
          foreignField: "parentId",
          as: "childs.childs",
          pipeline: [
            {
              $match: {
                deleted: false,
                published: true,
                active: true,
              },
            },
            { $project: { title: 1, slug: 1, createdAt: 1 } },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          slug: { $first: "$slug" },
          icon: { $first: "$icon" },
          createdAt: { $first: "$createdAt" },
          childs: { $push: "$childs" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);


    // const removeIndex = [];

    // categories.forEach((level1category, index) => {
    //   let filtered = level1category.childs.filter((value) => {
    //     return value.childs.length > 0;
    //   });

    //   categories[index].childs = filtered;

    //   if (
    //     !Array.isArray(level1category.childs) ||
    //     level1category.childs.length === 0
    //   ) {
    //     removeIndex.unshift(index);
    //   }
    // });

    // removeIndex.forEach((el) => {
    //   categories.splice(el, 1);
    // });

    res.status(200).json({
      setting: setting,
      categories: categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = layoutData;
