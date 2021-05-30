import { IRequest } from "./../../interfaces/requestInterface";
import { MSG } from "./../../utils/msg";
import User from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import utils from "../../utils/utils";

export default {
  /**
   * mutation "createUser": create new user
   * @param args : arguments came from graphql query
   */
  createUser: async (args: IRequest) => {
    try {
      // check if user exists
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error(MSG.USER_ALREADY_EXISTS);
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      // create user object and save it
      const userRef = new User({
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result: any = await userRef.save();

      return {
        ...result._doc,
        password: null,
        _id: result.id,
        createdTasks: utils.getUserById.bind(this, result._doc.createdTasks),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * mutation "login": login user
   * @param args : arguments came from graphql query
   */
  login: async (args: IRequest) => {
    // check if user exists
    const user: any = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error(MSG.WRONG_EMAIL_OR_PASSWORD);
    }

    // check if the passwords match
    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) {
      throw new Error(MSG.WRONG_EMAIL_OR_PASSWORD);
    }

    // generate the token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      utils.privateKey,
      {
        expiresIn: "2h", // expires in 2 hours
      }
    );

    return { userId: user.id, token, tokenExpiration: 1 };
  },
};
