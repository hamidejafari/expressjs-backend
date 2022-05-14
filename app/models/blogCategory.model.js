const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const blogCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleSeo: {
      type: String,
      required: false,
    },
    h1: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    descriptionSeo: {
      type: String,
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
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
    imageSeo: {
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

blogCategorySchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const BlogCategory = model("blogCategory", blogCategorySchema);

module.exports = BlogCategory;