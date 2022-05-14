const { Schema, model } = require("mongoose");

const bannerSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: false,
    },
    expireDate: {
      type: Date,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    brandExceptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "brand",
        required: false,
      },
    ],
    productExceptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: false,
      },
    ],
    modelId: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: false,
    },
    onModel: {
      type: String,
      required: false,
    },
    selected: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      fileName: {
        type: String,
        required: false,
      },
      alt: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);

const Banner = model("banner", bannerSchema);

module.exports = Banner;
