const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleSmall: {
      type: String,
      required: false,
    },
    titleSeo: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    h1: {
      type: String,
      required: false,
    },
    blogCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "blogCategory",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    descriptionSeo: {
      type: String,
      required: false,
    },
    shortDescription: {
      type: String,
      required: false,
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
    beforeDescImage: {
      fileName: {
        type: String,
        required: false,
      },
      alt: {
        type: String,
        required: false,
      },
    },
    afterDescImage: {
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
    relatedBlogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "blog",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

blogSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Blog = model("blog", blogSchema);

module.exports = Blog;
