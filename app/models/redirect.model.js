const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const redirectSchema = new Schema(
  {
    newAddress: {
      type: String,
      required: true,
    },
    oldAddress: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 301,
      enum: [301, 302],
    },
    type: {
      type: String,
      enum: ["page", "image"],
      default: "page",
    },
  },
  { timestamps: true }
);

redirectSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Redirect = model("redirect", redirectSchema);

module.exports = Redirect;
