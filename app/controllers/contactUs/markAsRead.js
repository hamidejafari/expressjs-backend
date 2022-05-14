const Contact = require("../../models/contact.model");

const markAsRead = async (req, res, next) => {
  try {
    const contacts = await Contact.findById(req.params._id);

    contacts.hasRead = true;

    await contacts.save();
    res.status(200).json("ok");
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = markAsRead;
