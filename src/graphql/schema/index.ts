import { buildSchema } from 'graphql';

export default buildSchema(`
type Task {
  _id: ID!
  title: String!
  description: String!
  date: String!
  isCompleted: Boolean!
  creator: User!
  comments: [Comment!]
  sharedWith: [User!]
}
type User {
  _id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String
  createdTasks: [Task!]
}
type Comment {
  _id: ID!
  task: Task!
  user: User!
  body: String!
  createdAt: String!
  updatedAt: String!
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
input TaskInput {
  title: String!
  description: String!
  date: String!
}
input UpdateTaskInput {
  id: ID!
  title: String!
  description: String!
  date: String!
}
input UserSignUpInput {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
}
input UserSignInInput {
  email: String!
  password: String!
}
input CommentTaskInput {
  taskId: ID!
  body: String!
}
type RootQuery {
  tasks: [Task!]!
  login(email: String!, password: String!): AuthData!
}
type RootMutation {
  createTask(taskInput: TaskInput): Task
  updateTask(updateTaskInput: UpdateTaskInput): Task
  changeTaskStatus(taskId: ID!, status: Boolean!): Task
  deleteTask(taskId: ID!): String
  createUser(userInput: UserSignUpInput): User
  commentTask(commentTaskInput: CommentTaskInput): Task
  shareTask(taskId: ID!, usersIds: String!): Task
}
schema {
  query: RootQuery
  mutation: RootMutation
}
`);