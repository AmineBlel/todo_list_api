import mongoose from 'mongoose';

// declare schema from mongoose
const Schema = mongoose.Schema;

// declare user schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdTasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
});

const User = mongoose.model('User', userSchema);
export default User;