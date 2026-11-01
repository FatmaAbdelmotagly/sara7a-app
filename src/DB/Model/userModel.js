import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/index.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: function () {
        return this.provider == ProviderEnum.SYSTEM;
      },
    },
    phone: {
      type: String,
      require: true,
    },
    image: String,
    cover: [String],
    confirmEmail: Date,
    changeCredintialTime: Date,
    gender: {
      type: Number,
      default: GenderEnum.MALE,
      enum: Object.values(GenderEnum),
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    role: {
      type: Number,
      default: RoleEnum.USER,
      enum: Object.values(RoleEnum),
    },
    provider: {
      type: Number,
      default: ProviderEnum.SYSTEM,
      enum: Object.values(ProviderEnum),
    },
    confirmPassword: String,
  },
  {
    Timestamp: true,
  },
);

export const UserModel = mongoose.model("User", userSchema);
