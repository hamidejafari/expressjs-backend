const adminAll = require("./adminAll");
const create = require("./create");
const remove = require("./remove");
const update = require("./update");
const restore = require("./restore");
const findOne = require("./findOne");
const adminAllTrash = require("./adminAllTrash");
const imageUpdate = require("./imageUpdate");
const adminAllSelect = require("./adminAllSelect");

module.exports = {
  adminAll,
  create,
  remove,
  findOne,
  update,
  restore,
  adminAllTrash,
  adminAllSelect,
  imageUpdate,
};
