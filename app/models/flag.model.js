const { Schema, model } = require("mongoose");

const flagSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    unicode: {
      type: String,
      required: false,
    },
  },
  { timestamps: false }
);

const Flag = model("flag", flagSchema);

module.exports = Flag;
