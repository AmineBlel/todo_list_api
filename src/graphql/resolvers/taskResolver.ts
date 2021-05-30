import { IRequest } from "./../../interfaces/requestInterface";
import Task from "../../models/task";
import User from "../../models/user";
import utils from "../../utils/utils";
import { MSG } from "../../utils/msg";

export default {
  /**
   * query "tasks": get user's tasks that created or shared with him
   * @param args : arguments came from graphql query
   * @param req : arguments came from middleware
   */
  tasks: async (args: IRequest, req: IRequest) => {
    try {
      // check authentication
      if (!req.isAuthenticated) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // check if user exists
      const user: any = await User.findById(req.userId);
      if (!user) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // get the tasks that created or shared with the user
      const tasks = await Task.find({
        $or: [{ sharedWith: user._id }, { creator: user._id }],
      });

      // map on the tasks to parse them for the return
      return tasks.map((task: any) => {
        return {
          ...task._doc,
          _id: task.id,
          creator:
            task._doc.creator._id.toString() !== req.userId.toString()
              ? utils.getOtherUserById.bind(this, task._doc.creator)
              : utils.getUserById.bind(this, task._doc.creator),
          sharedWith: utils.getUsersByIds.bind(this, task._doc.sharedWith),
          comments: utils.getComments.bind(this, task._doc.comments),
        };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * mutation "createTask": create new task
   * @param args : arguments came from graphql query
   * @param req : arguments came from middleware
   */
  createTask: async (args: IRequest, req: IRequest) => {
    try {
      // check authentication
      if (!req.isAuthenticated) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // check if user exists
      const user: any = await User.findById(req.userId);
      if (!user) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // declare value to return
      let createdTask = {};

      // create task object and save it
      const task = new Task({
        title: args.taskInput.title,
        description: args.taskInput.description,
        date: new Date(args.updateTaskInput.date).toISOString(),
        isCompleted: false,
        creator: req.userId,
        comments: [],
        sharedWith: [],
      });
      const result: any = await task.save();

      // push task on user's created tasks and update user
      user.createdTasks.push(task);
      await user.save();

      // parse to the value to return
      createdTask = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: utils.getUserById.bind(this, result._doc.creator),
        sharedWith: utils.getUsersByIds.bind(this, result._doc.sharedWith),
        comments: utils.getComments.bind(this, result._doc.comments),
      };

      return createdTask;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * mutation "updateTask": update task
   * @param args : arguments came from graphql query
   * @param req : arguments came from middleware
   */
  updateTask: async (args: IRequest, req: IRequest) => {
    try {
      // check authentication
      if (!req.isAuthenticated) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // check if user exists
      const user: any = await User.findById(req.userId);
      if (!user) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // declare value to return
      let updatedTask = {};

      // get the task
      let taskData = (await Task.findById(args.updateTaskInput.id)) as any;

      // check if the user is the task's owner
      if (user._doc._id.toString() !== taskData._doc.creator._id.toString()) {
        throw new Error(MSG.NOT_THE_OWNER);
      }

      // put the new values and update the task
      taskData.title = args.updateTaskInput.title;
      taskData.description = args.updateTaskInput.description;
      taskData.date = new Date(args.updateTaskInput.date).toISOString();
      const result: any = await taskData.save();

      // parse to the value to return
      updatedTask = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: utils.getUserById.bind(this, result._doc.creator),
        sharedWith: utils.getUsersByIds.bind(this, result._doc.sharedWith),
        comments: utils.getComments.bind(this, result._doc.comments),
      };
      return updatedTask;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * mutation "changeTaskStatus": change task's status to completed/not completed
   * @param args : arguments came from graphql query
   * @param req : arguments came from middleware
   */
  changeTaskStatus: async (args: IRequest, req: IRequest) => {
    try {
      // check authentication
      if (!req.isAuthenticated) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // check if user exists
      const user: any = await User.findById(req.userId);
      if (!user) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // declare value to return
      let updatedTask = {};

      // get the task
      let taskData = (await Task.findById(args.taskId)) as any;

      // check if the user is the task's owner
      if (user._doc._id.toString() !== taskData._doc.creator._id.toString()) {
        throw new Error(MSG.NOT_THE_OWNER);
      }

      // put the new status value and update the task
      taskData.isCompleted = args.status;
      const result: any = await taskData.save();

      // parse to the value to return
      updatedTask = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: utils.getUserById.bind(this, result._doc.creator),
        sharedWith: utils.getUsersByIds.bind(this, result._doc.sharedWith),
        comments: utils.getComments.bind(this, result._doc.comments),
      };
      return updatedTask;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * mutation "deleteTask": delete task
   * @param args : arguments came from graphql query
   * @param req : arguments came from middleware
   */
  deleteTask: async (args: IRequest, req: IRequest) => {
    try {
      // check authentication
      if (!req.isAuthenticated) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // check if user exists
      const user: any = await User.findById(req.userId);
      if (!user) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // get the task
      let taskData = (await Task.findById(args.taskId)) as any;

      // check if the user is the task's owner
      if (user._doc._id.toString() !== taskData._doc.creator._id.toString()) {
        throw new Error(MSG.NOT_THE_OWNER);
      }

      // delete task
      await Task.deleteOne({ _id: args.taskId });
      return MSG.TASK_DELETED;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * mutation "shareTask": share task with other users
   * @param args : arguments came from graphql query
   * @param req : arguments came from middleware
   */
  shareTask: async (args: IRequest, req: IRequest) => {
    try {
      // check authentication
      if (!req.isAuthenticated) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // check if user exists
      const user: any = await User.findById(req.userId);
      if (!user) {
        throw new Error(MSG.UNAUTHORIZED_USER);
      }

      // declare value to return
      let updatedTask = {};

      // get the task
      let taskData = (await Task.findById(args.taskId)) as any;

      // check if the user is the task's owner
      if (user._doc._id.toString() !== taskData._doc.creator._id.toString()) {
        throw new Error(MSG.NOT_THE_OWNER);
      }

      // split the list of users ids into array
      const usersIds = args.usersIds.split(",");

      // put the new value and update the task
      taskData.sharedWith = usersIds;
      const result: any = await taskData.save();

      // parse to the value to return
      updatedTask = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: utils.getUserById.bind(this, result._doc.creator),
        sharedWith: utils.getUsersByIds.bind(this, result._doc.sharedWith),
        comments: utils.getComments.bind(this, result._doc.comments),
      };
      return updatedTask;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
