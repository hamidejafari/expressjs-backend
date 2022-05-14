const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const productSchema = new Schema(
  {
    descriptionConvert2: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      required: false,
      default: true,
    },
    fixedImage: {
      type: Boolean,
      required: false,
      default: false,
    },
    noIndex: {
      type: Boolean,
      required: false,
      default: false,
    },
    publishDate: {
      type: Date,
      required: false,
    },
    reviewsFix: {
      type: Boolean,
      required: true,
      default: false,
    },
    reviewsCount: {
      type: Number,
      required: false,
      default: 0,
    },
    titleSeo: {
      type: String,
      required: false,
    },
    descriptionSeo: {
      type: String,
      required: false,
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
    descriptionShort: {
      type: String,
      required: false,
    },
    descriptionBest: {
      type: String,
      required: false,
    },
    siteUrl: {
      type: String,
      required: false,
    },
    overalRating: {
      type: Number,
      required: false,
    },
    star: {
      type: Number,
      required: false,
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
    images: [
      {
        fileName: {
          type: String,
          required: false,
        },
        alt: {
          type: String,
          required: false,
        },
      },
    ],
    beforeAfters: [
      {
        fileName: {
          type: String,
          required: false,
        },
        alt: {
          type: String,
          required: false,
        },
      },
    ],
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
    active: {
      type: Boolean,
      required: false,
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
      required: false,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
    },
    clickSiteCount: {
      type: Number,
      required: false,
      default: 0,
    },
    utmLink: {
      type: String,
      required: false,
    },
    youtubeVideoLink: {
      type: String,
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    extraCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],
    tagIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "tag",
        required: true,
      },
    ],
    coupons: [
      {
        type: Schema.Types.ObjectId,
        ref: "coupon",
        required: true,
      },
    ],
    categoryStanding: {
      type: Number,
      required: false,
    },
    attributes: [
      {
        attributeId: {
          type: Schema.Types.ObjectId,
          required: false,
        },
        attributeValue: {
          type: String,
          required: false,
        },
      },
    ],
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "brand",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Product = model("product", productSchema);

module.exports = Product;
