const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const tagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleSeo: {
      type: String,
      required: false,
    },
    published: {
      type: Boolean,
      required: false,
      default: true,
    },
    publishDate: {
      type: Date,
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    noIndex: {
      type: Boolean,
      required: false,
      default: false,
    },
    description: [
      {
        desc: {
          type: String,
          required: false,
        },
        header: {
          type: String,
          required: false,
        },
        headerType: {
          type: String,
          enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
          required: false,
        },
      },
    ],
    descriptionSeo: {
      type: String,
      required: false,
    },

    h1: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

tagSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Tag = model("tag", tagSchema);

module.exports = Tag;
