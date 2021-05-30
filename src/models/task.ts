import mongoose from 'mongoose';

// declare schema from mongoose
const Schema = mongoose.Schema;

// declare task schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Task = mongoose.model('Task', taskSchema);
export default Task;