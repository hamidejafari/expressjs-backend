const Category = require("../../models/category.model");
const LogService = require("../../services/log.service");
// const Product = require("../../models/product.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const restore = async (req, res, next) => {
  try {
    const category = await Category.findOneDeleted({ _id: req.params._id });

    await LogService.create({
      model: "category",
      url: req.originalUrl,
      method: req.method,
      data: category,
      modelId: category._id,
      userId: req.user._id,
    });

    // const parentIds = [];
    // const categoryIds = [];

    // if (category.level == 1) {
    //   const childCategory = await Category.findDeleted({
    //     parentId: category._id,
    //   }).select("_id");
    //   childCategory.forEach((element) => {
    //     parentIds.push(element._id);
    //   });

    //   const lastLeveLCategories = await Category.findDeleted({
    //     parentId: { $in: parentIds },
    //   }).select("_id");
    //   lastLeveLCategories.forEach((element) => {
    //     categoryIds.push(element._id);
    //   });

    //   parentIds.push(category._id);
    // }

    // if (category.level == 2) {
    //   const lastLeveLCategories = await Category.findDeleted({
    //     parentId: category._id,
    //   }).select("_id");
    //   lastLeveLCategories.forEach((element) => {
    //     categoryIds.push(element._id);
    //   });

    //   parentIds.push(category._id);
    // }

    // if (category.level == 3) {
    //   categoryIds.push(category._id);
    // }

    // await Category.restore({ parentId: { $in: parentIds } });
    // await Product.restore({ categoryId: { $in: categoryIds } });

    await category.restore();

    if (category.published && category.active) {
      const body = {
        _id: category._id,
        title: category.title,
        slug: category.slug,
        level: category.level,
      };

      if (category?.icon?.fileName) {
        body.image = "files/images/small/" + category?.icon?.fileName;
      }
      await elasticsearchService.put("categories", body);
    }

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = restore;
