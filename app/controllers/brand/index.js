const adminAll = require("./adminAll");
const create = require("./create");
const remove = require("./remove");
const update = require("./update");
const restore = require("./restore");
const findOne = require("./findOne");
const addAttribute= require("./addAttribute");
const adminAllTrash = require("./adminAllTrash");
const adminSelectBox = require("./adminSelectBox");
const imageUpdate = require("./imageUpdate");

module.exports = {
  adminAll,
  create,
  remove,
  adminSelectBox,
  findOne,
  addAttribute,
  update,
  restore,
  adminAllTrash,
  imageUpdate,
};
