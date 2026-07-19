import mongoose, { models } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["mindmap"],
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
});

const Topic = models?.Topic || mongoose.model("Topic", topicSchema);
export default Topic;
