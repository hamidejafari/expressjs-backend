const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "review",
      required: false,
    },
    depth: {
      type: Number,
      required: true,
      default: 1,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "denied", "deletedByBusiness"],
      required: true,
      default: "pending",
    },
    star: {
      type: Number,
      required: false,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    onModel: {
      type: String,
      required: true,
    },
    modelId: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: true,
    },
    showHomePage: {
      type: Boolean,
      required: false,
    },
    createdAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

reviewSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Review = model("review", reviewSchema);

module.exports = Review;
