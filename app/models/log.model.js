const { Schema, model } = require("mongoose");

const logSchema = new Schema(
  {
    model: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    modelId: {
      type: Schema.Types.ObjectId,
      refPath: "model",
      required: false,
    },
  },
  { timestamps: true }
);

const Log = model("log", logSchema);

module.exports = Log;
