import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    clerkId: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    tokens: {
      type: Number,
      required: true,
      default: 20,
    },
  },
  { timestamps: true }
);

const User = models?.User || mongoose.model("User", userSchema);
export default User;
