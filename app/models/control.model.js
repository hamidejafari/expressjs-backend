const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const controlSchema = new Schema(
  {
    newTitle: {
      type: String,
      required: false,
    },
    newSlug: {
        type: String,
        required: false,
    },
    oldTitle: {
        type: String,
        required: false,
    },
    oldSlug: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
        enum: ["brand", "category","product"],
    },
    redirected: {
      type: Boolean,
      required: true,
      default: false
    },
    fixed: {
      type: Boolean,
      required: true,
      default: false
    },
    fixedHamide: {
      type: Boolean,
      required: true,
      default: false
    },
    isNotFound: {
      type: Boolean,
      required: true,
      default: false
    },
    fixed2: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  { timestamps: true }
);


controlSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});


const Control = model("control", controlSchema);

module.exports = Control;