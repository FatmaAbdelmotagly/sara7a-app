import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    identityRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IdentityRequest",
      required: true,
      unique: true,
    },

    lastMessage: {
      type: String,
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
