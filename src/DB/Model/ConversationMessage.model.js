import mongoose from "mongoose";

const conversationMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50000,
    },
    attachment: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const ConversationMessage = mongoose.model(
  "ConversationMessage",
  conversationMessageSchema,
);
