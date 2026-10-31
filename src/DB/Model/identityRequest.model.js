
import mongoose, { Schema, model } from "mongoose";
import { StatusEnum } from "../../common/enum/status.enum.js";

const identityRequestSchema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },

    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: Number,
      enum: Object.values(StatusEnum),
      default: StatusEnum.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const IdentityRequest = model("IdentityRequest",identityRequestSchema);


