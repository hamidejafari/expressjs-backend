const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const comparisonSchema = new Schema(
  {
    titleSeo: {
      type: String,
      required: false,
    },
    descriptionSeo: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    descriptionShort: {
      type: String,
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    compare1Id: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: true,
    },
    compare2Id: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: true,
    },
    winnerId: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: false,
    },
    onModel: {
      type: String,
      enum: ["brand", "product"],
      required: true,
    },
    showHomePage: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

comparisonSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Comparison = model("comparison", comparisonSchema);

module.exports = Comparison;
