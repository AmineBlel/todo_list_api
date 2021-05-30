import Task from "../models/task";
import User from "../models/user";
import Comment from "../models/comment";

/**
 * get user details by id
 * @param userId : user id
 * @returns : user details
 */
const getUserById = async (userId: String) => {
  try {
    // get the user by id
    const user = (await User.findById(userId)) as any;

    // parse result to return
    return {
      ...user._doc,
      _id: userId,
      createdTasks: getTasksByIds.bind(this, user._doc.createdTasks),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * get details of the not connected user
 * @param userId : user id
 * @returns : user details
 */
const getOtherUserById = async (userId: String) => {
  try {
    // get the user by id
    const user = (await User.findById(userId)) as any;

    // parse result to return
    return {
      ...user._doc,
      _id: userId,
      createdTasks: null, // not return the created tasks of that user
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * get details of list of users by their ids
 * @param userIds : array of users ids
 * @returns : array of users details
 */
const getUsersByIds = async (userIds: String[]): Promise<any> => {
  try {
    // get the list of users
    const users = await User.find({ _id: { $in: userIds } });

    // parse result to return
    return users.map((user: any) => {
      return {
        ...user._doc,
        _id: user.id,
        createdTasks: null, // not return the created tasks of these users
      };
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * get details of list of comments by their ids
 * @param commentIds : array of comments ids
 * @returns : array of comments details
 */
const getComments = async (commentIds: String[]): Promise<any> => {
  try {
    // get the list of comments
    const comments = await Comment.find({ _id: { $in: commentIds } });

    // parse result to return
    return comments.map((comment: any) => {
      return {
        ...comment._doc,
        _id: comment.id,
        user: getUserById.bind(this, comment._doc.user),
        task: getTaskById.bind(this, comment._doc.task),
      };
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * get task details by id
 * @param taskId : task id
 * @returns : task details
 */
const getTaskById = async (taskId: String) => {
  try {
    // get the task by id
    const taskData = (await Task.findById(taskId)) as any;

    // parse result to return
    return {
      ...taskData._doc,
      _id: taskData.id,
      creator: getUserById.bind(this, taskData._doc.creator),
      sharedWith: getUsersByIds.bind(this, taskData._doc.sharedWith),
      comments: getComments.bind(this, taskData._doc.comments)
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * get details of list of tasks by their ids
 * @param taskIds : array of tasks ids
 * @returns : array of tasks details
 */
const getTasksByIds = async (taskIds: String[]): Promise<any> => {
  try {
    // get the list of comments
    const tasks = await Task.find({ _id: { $in: taskIds } });

    // parse result to return
    return tasks.map((task: any) => {
      return {
        ...task._doc,
        _id: task.id,
        creator: getUserById.bind(this, task._doc.creator),
        sharedWith: getUsersByIds.bind(this, task._doc.sharedWith),
        comments: getComments.bind(this, task._doc.comments)
      };
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// key to generate the token
const privateKey = '3jBzRjBzjwr9qHvRG/JklXZ5otafSd12KtTSEySsvPjiTb1iZybF6/r+iQIDAQABAoGAWRjww3IrNLxFvzwURBeCKUbX6VjTI8qLrnYA3cUkvDtwa5kkeG1';

export default { getUserById, getOtherUserById, getTaskById, getTasksByIds, getComments, getUsersByIds, privateKey };
