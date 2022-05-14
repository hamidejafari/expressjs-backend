const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const businessProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
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
    youtubeVideoLink: {
      type: String,
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    businessBrandId: {
      type: Schema.Types.ObjectId,
      ref: "businessBrand",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["created by brandsreviews", "pending", "accepted", "rejected", "partly accepted"],
      default: "created by brandsreviews",
    },
  },
  { timestamps: true }
);

businessProductSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const BusinessProduct = model("businessProduct", businessProductSchema);

module.exports = BusinessProduct;
