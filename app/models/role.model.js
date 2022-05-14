const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const roleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    frontPermissions: [
      {
        type: String,
        required: true,
      },
    ],
    backPermissions: [
      {
        url: {
          type: String,
          required: true,
        },
        method: {
          type: String,
          required: true,
        },
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "category",
      },
    ],
  },
  { timestamps: true }
);

roleSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const Role = model("role", roleSchema);
module.exports = Role;
