import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      require: function () {
        return this.attachment?.length > 0 ? false : true;
      },
      minLength: 2,
      maxLength: 50000,
    },
    attachment: {
      type: [String],
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recieverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export const messageModel = mongoose.model("message", messageSchema);
