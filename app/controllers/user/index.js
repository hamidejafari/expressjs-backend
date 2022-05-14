const all = require("./all");
const login = require("./login");
const create = require("./create");
const update = require("./update");
const userDetails = require("./userDetails");
const allAdmins = require("./allAdmins");
const createAdmin = require("./createAdmin");
const getOneAdmin = require("./getOneAdmin");
const updateAdmin = require("./updateAdmin");
const forgetPassword = require("./forgetPassword");

module.exports = {
  all,
  create,
  login,
  update,
  userDetails,
  allAdmins,
  createAdmin,
  getOneAdmin,
  updateAdmin,
  forgetPassword,
};
