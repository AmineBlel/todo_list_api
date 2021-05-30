import { IRequest } from "./../../interfaces/requestInterface";
import User from "../../models/user";
import Task from "../../models/task";
import Comment from "../../models/comment";
import utils from "../../utils/utils";
import { MSG } from "../../utils/msg";

export default {

  /**
   * mutation "commentTask": comment on task
   * @param args : arguments came from graphql query
   * @param req : arguments came from middleware
   */
  commentTask: async (args: IRequest, req: IRequest) => {
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
      let taskData = (await Task.findById(args.commentTaskInput.taskId)) as any;

      // create comment object and save it
      const comment = new Comment({
        task: taskData._id,
        user: req.userId,
        body: args.commentTaskInput.body,
      });
      await comment.save();

      // push comment in task's comments and update task
      taskData._doc.comments.push(comment);
      await taskData.save();

      return {
        ...taskData._doc,
        _id: taskData.id,
        creator:
          taskData._doc.creator._id.toString() !== req.userId.toString()
            ? utils.getOtherUserById.bind(this, taskData._doc.creator)
            : utils.getUserById.bind(this, taskData._doc.creator),
        sharedWith: utils.getUsersByIds.bind(this, taskData._doc.sharedWith),
        comments: utils.getComments.bind(this, taskData._doc.comments),
      };
    } catch (error) {
      throw error;
    }
  },
};
