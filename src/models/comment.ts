import mongoose from "mongoose";

// declare schema from mongoose
const Schema = mongoose.Schema;

// declare comment schema
const commentSchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // to save createdAt and updatedAt
);

const Task = mongoose.model("Comment", commentSchema);
export default Task;
