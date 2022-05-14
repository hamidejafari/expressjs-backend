const LogService = require("../../services/log.service");
const Role = require("../../models/role.model");

const create = async (req, res, next) => {
  try {
    const role = new Role({
      title: req.body.title,
      categories: req.body.categories,
      frontPermissions: req.body.frontPermissions,
      backPermissions: req.body.backPermissions,
    });

    await LogService.create({
      model: "user",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: role._id,
      userId: req.user._id,
    });

    await role.save();
    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
