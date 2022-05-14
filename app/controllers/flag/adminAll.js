const Flag = require("../../models/flag.model");

const adminAll = async (req, res, next) => {
  try {
    const flags = await Flag.find();

    res.status(200).json({ data: flags });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
