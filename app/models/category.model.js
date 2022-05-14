const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const categorySchema = new Schema(
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
    type: {
      type: String,
      enum: ["category", "comparison"],
      default: "category",
      required: true,
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
    attributes: [
      {
        position: {
          type: Number,
          required: false,
        },
        title: {
          type: String,
          required: false,
        },
      },
    ],
    descriptionSeo: {
      type: String,
      required: false,
    },
    icon: {
      fileName: {
        type: String,
        required: false,
      },
      alt: {
        type: String,
        required: false,
      },
    },
    headerImage: {
      fileName: {
        type: String,
        required: false,
      },
      alt: {
        type: String,
        required: false,
      },
    },
    iconSeo: {
      fileName: {
        type: String,
        required: false,
      },
      alt: {
        type: String,
        required: false,
      },
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
    active: {
      type: Boolean,
      required: false,
    },
    noIndex: {
      type: Boolean,
      required: false,
      default: false,
    },
    showHomePage: {
      type: Boolean,
      required: false,
    },
    h1: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: false,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: false,
    },
    bannerId: {
      type: Schema.Types.ObjectId,
      ref: "banner",
      required: false,
    },
    isOldSlug: {
      type: Boolean,
      default: false,
      required: true,
    },
    level: {
      type: Number,
      // enum: [1, 2, 3],
      required: false,
    },
    brands: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "brand",
          required: true,
        },
        standing: {
          type: Number,
          required: false,
        },
      },
    ],
    draftBrands: [
      [
        {
          _id: {
            type: Schema.Types.ObjectId,
            ref: "brand",
            required: true,
          },
          standing: {
            type: Number,
            required: false,
          },
        },
      ],
    ],
    products: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        standing: {
          type: Number,
          required: false,
        },
      },
    ],
    draftProducts: [
      [
        {
          _id: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true,
          },
          standing: {
            type: Number,
            required: false,
          },
        },
      ],
    ],
    fixed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Category = model("category", categorySchema);

module.exports = Category;
