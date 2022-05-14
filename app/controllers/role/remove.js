const Role = require("../../models/role.model");

const remove = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params._id);
    await role.delete();
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
