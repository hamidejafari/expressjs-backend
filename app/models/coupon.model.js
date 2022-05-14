const { Schema, model } = require("mongoose");

const couponSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleSeo: {
      type: String,
      required: false,
    },
    occasion: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    descriptionSeo: {
      type: String,
      required: false,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expireDate: {
      type: Date,
      required: false,
    },
    showHomePage: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const Coupon = model("coupon", couponSchema);

module.exports = Coupon;
