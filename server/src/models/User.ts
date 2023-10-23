import mongoose from "mongoose";
import { IUser } from "../types/IUser.js";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    pictureId: { type: Number, required: true },
    online: { type: Boolean, required: true },
    password: { type: String, required: true, select: false },
    conversationIds: { type: [String], select: false },
  },
  { collection: "user-data" }
);

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model<IUser>("UserData", UserSchema);
