const Role = require("../../models/role.model");
const LogService = require("../../services/log.service");

const update = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params._id);
    role.title = req.body.title;
    role.frontPermissions = req.body.frontPermissions;
    role.categories = req.body.categories;
    await role.save();

    await LogService.create({
      model: "user",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: role._id,
      userId: req.user._id,
    });

    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

module.exports = update;
