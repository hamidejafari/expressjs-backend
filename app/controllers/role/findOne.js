const Role = require("../../models/role.model");

const all = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params._id).populate("categories");
    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

module.exports = all;
