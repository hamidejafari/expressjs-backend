const adminAll = require("./adminAll");
const adminGetAllParent = require("./adminGetAllParent");
const adminGetLevelTwo = require("./adminGetLevelTwo");
const adminGetLevelOne = require("./adminGetLevelOne");
const adminGetLevelOneAndTwo = require("./adminGetLevelOneAndTwo");
const adminGetLevelThree = require("./adminGetLevelThree");
const create = require("./create");
const remove = require("./remove");
const update = require("./update");
const findOne = require("./findOne");
const sortBrand = require("./sortBrand");
const sortProduct = require("./sortProduct");
const categoryAttributes = require("./categoryAttributes");
const categoryVsProducts = require("./categoryVsProducts");
const adminBestAll = require("./adminBestAll");
const lessFiveProductRate = require("./lessFiveProductRate");
const adminAllTrash = require("./adminAllTrash");
const restore = require("./restore");
const image = require("./image");
const imageUpdate = require("./imageUpdate");
const bestNotRate = require("./bestNotRate");
const categoryNoProduct = require("./categoryNoProduct");
const adminAllSelect = require("./adminAllSelect");
const adminGetLevelOneAndTwoSelect = require("./adminGetLevelOneAndTwoSelect");

module.exports = {
  adminAll,
  adminGetAllParent,
  adminGetLevelThree,
  adminGetLevelTwo,
  adminGetLevelOne,
  create,
  remove,
  findOne,
  update,
  adminGetLevelOneAndTwo,
  sortBrand,
  categoryAttributes,
  categoryVsProducts,
  sortProduct,
  lessFiveProductRate,
  adminAllTrash,
  adminBestAll,
  restore,
  imageUpdate,
  image,
  bestNotRate,
  categoryNoProduct,
  adminAllSelect,
  adminGetLevelOneAndTwoSelect,
};
