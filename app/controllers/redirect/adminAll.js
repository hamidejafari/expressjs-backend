const Redirect = require("../../models/redirect.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = { type: "page" };
    if (req.query.address) {
      query.$or = [
        { newAddress: { $regex: req.query.address.trim(), $options: "i" } },
        { oldAddress: { $regex: req.query.address.trim(), $options: "i" } },
      ];
    }

    const redirects = await Redirect.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");
    const count = await Redirect.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: redirects, meta: { count, lastPage } });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
