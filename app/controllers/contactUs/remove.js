const Contact = require("../../models/contact.model");

const remove = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params._id);
    await contact.delete();
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = remove;
