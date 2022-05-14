const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const brandSchema = new Schema(
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
    noIndex: {
      type: Boolean,
      required: false,
      default: false,
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
    descriptionShort: {
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
    imageProduct: {
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
    siteUrl: {
      type: String,
      required: false,
    },
    utmLink: {
      type: String,
      required: false,
    },
    youtubeVideoLink: {
      type: String,
      required: false,
    },
    special: {
      type: String,
      enum: ["friend", "enemy", "ourBrand", "normal"],
      required: false,
      default: "normal",
    },
    clickSiteCount: {
      type: Number,
      required: false,
      default: 0,
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
    overalRating: {
      type: Number,
      required: false,
    },
    star: {
      type: Number,
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
    rate: {
      type: Number,
      required: false,
    },
    oldSlug: {
      type: String,
      required: false,
    },
    hasCoupon: {
      type: Boolean,
      required: true,
      default: false,
    },
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
    searchTags: [
      {
        type: String,
        required: true,
      },
    ],
    flag: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "flag",
        required: false,
      },
      code: {
        type: String,
        required: false,
      },
      emoji: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
    },
    categories: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "category",
          required: true,
        },
        standing: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

brandSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Brand = model("brand", brandSchema);

module.exports = Brand;
