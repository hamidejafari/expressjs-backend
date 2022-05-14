const Contact = require("../../models/contact.model");

const adminAll = async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.firstName) {
      query.firstName = { $regex: req.query.firstName.trim(), $options: "i" };
    }
    if (req.query.lastName) {
      query.lastName = { $regex: req.query.lastName.trim(), $options: "i" };
    }

    const contacts = await Contact.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");

    const count = await Contact.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({ data: contacts, meta: { count, lastPage } });
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = adminAll;
