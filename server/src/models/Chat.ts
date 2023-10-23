import mongoose from "mongoose";
import { IChat } from "../types/IChat.js";

const ChatSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, required: true },
    messages: [
      {
        sender: {
          type: String,
          required: false,
        },
        receiver: {
          type: String,
          required: false,
        },
        content: {
          type: String,
          required: false,
        },
        date: {
          type: Date,
          required: false,
        },
      },
    ],
  },
  { collection: "chat-data" }
);

export const Chat = mongoose.model<IChat>("ChatData", ChatSchema);
