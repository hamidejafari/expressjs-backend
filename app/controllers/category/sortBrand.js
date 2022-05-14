const Category = require("../../models/category.model");
const Brand = require("../../models/brand.model");
const LogService = require("../../services/log.service");

const sortBrand = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.categoryId);
    const sort = req.body.sortObject;
    category.brands = sort[0];
    category.draftBrands = [sort[1], sort[2]];
    await category.save();

    sort[0].forEach(async (element) => {
      const brand = await Brand.findById(element._id);
      const brandObjOld = brand.categories;
      const brandObjNew = [];
      brandObjOld.forEach((item) => {
        if (JSON.stringify(item._id) !== JSON.stringify(category._id)) {
          brandObjNew.push(item);
        }
      });

      brandObjNew.push({
        _id: category._id,
        standing: element.standing,
      });

      brand.categories = brandObjNew;
      await brand.save();
    });

    await LogService.create({
      model: "category",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: category._id,
      userId: req.user._id,
    });

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = sortBrand;
