const jwt = require("jsonwebtoken");
const { Schema, model } = require("mongoose");
const mongoose_delete = require("../services/mongooseSoftDelete.service");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    family: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      defaultValue: "user",
      required: true,
      default: "user",
      enum: ["user", "admin", "business"],
    },
    password: {
      type: String,
      required: false,
    },
    confirmCode: {
      type: String,
      required: false,
    },
    confirmationPassword: {
      type: String,
      required: false,
    },
    passwordReset: {
      code: { type: String, required: false },
      expire: { type: Date, required: false },
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "role",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  return jwt.sign({ user_id: this._id }, process.env.TOKEN_KEY, {
    expiresIn: "1Y",
  });
};

userSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: true,
});

const User = model("user", userSchema);

module.exports = User;
