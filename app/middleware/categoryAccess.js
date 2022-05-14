const Category = require("../models/category.model");

const categoryAccess = async (req, res, next) => {
  const categoryIds = [];
  if (Array.isArray(req.user?.permissions)) {
    req.user?.permissions.forEach((permission) => {
      if (Array.isArray(permission.categories)) {
        permission.categories.forEach((category) => {
          categoryIds.push(category);
        });
      }
    });
  }

  const level2Categories = await Category.find(
    {
      parentId: { $in: categoryIds },
    },
    "_id"
  ).lean();

  const level3Categories = await Category.find(
    {
      parentId: { $in: level2Categories },
    },
    "_id"
  ).lean();

  const ids = [...categoryIds, ...level2Categories, ...level3Categories].map(
    (element) => element._id.toString()
  );

  req.categoryIds = ids;

  return next();
};

module.exports = categoryAccess;
