const { Schema, model } = require("mongoose");

const businessBrandSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    productCount: {
      type: Number,
      default: 0,
      required: true,
    },
    descriptionShort: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    siteUrl: {
      type: String,
      required: true,
    },
    youtubeVideoLink: {
      type: String,
      required: false,
    },
    faq: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    pros: [
      {
        type: String,
        required: true,
      },
    ],
    cons: [
      {
        type: String,
        required: true,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "brand",
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "created by brandsreviews",
        "pending",
        "accepted",
        "rejected",
        "partly accepted",
      ],
      default: "created by brandsreviews",
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const BusinessBrand = model("businessBrand", businessBrandSchema);

module.exports = BusinessBrand;
