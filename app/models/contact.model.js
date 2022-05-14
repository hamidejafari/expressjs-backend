const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    messageText: {
        type: String,
        required: true,
    },
    hasRead: {
        type: Boolean,
        required: true,
        default: false,
    }
  },
  { timestamps: true }
);


const Contact = model("contact", contactSchema);

module.exports = Contact;