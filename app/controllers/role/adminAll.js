const Role = require("../../models/role.model");

//test
const adminAll = async (req, res, next) => {
  try {
    const roles = await Role.find().sort("-createdAt");
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
