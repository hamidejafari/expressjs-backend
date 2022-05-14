const { Schema, model } = require("mongoose");

const settingSchema = new Schema(
  {
    titleSeo: {
      type: String,
      required: true,
    },
    description: {
        type: String,
        required: true,
    },
    firstPageHeader: {
        type: String,
        required: true,
    },
    firstPageHeaderBold: {
        type: String,
        required: true,
    },
    firstPageBanner: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    favicon: {
        type: String,
        required: false,
    },
    brandCount: {
        type: String,
        required: true,
    },
    productCount: {
        type: String,
        required: true,
    },
    comparisonCount: {
        type: String,
        required: true,
    },
    couponCount: {
        type: String,
        required: true,
    },
    bestRatingCount: {
        type: String,
        required: true,
    },
    reviewCount: {
        type: String,
        required: true,
    },
    footerInfo: {
        type: String,
        required: true,
    },
    footerContent: {
        type: String,
        required: true,
    },
    footerContact: {
        type: String,
        required: true,
    },
    tiktok: {
        type: String,
        required: false,
    },
    facebook: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },
    instagram: {
        type: String,
        required: false,
    },
    pinterest: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    }
  },
  { timestamps: true }
);


const Setting = model("setting", settingSchema);

module.exports = Setting;