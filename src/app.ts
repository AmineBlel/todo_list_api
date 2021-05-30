import mongoose from 'mongoose';
import express from "express";
import { graphqlHTTP } from "express-graphql";
import schemas from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { isAuthenticated } from './middleware/is-authenticated';

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  isAuthenticated, // middleware to check authentication, returns the key isAuthenticated when we need it
  graphqlHTTP({
    schema: schemas,
    rootValue: resolvers,
    graphiql: true, // for dev purposes
  })
);

// connect to mongoDb with mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dmbsh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3001, () => {
      console.log("server listening on port 3001");
    });
  })
  .catch((error) => {
    console.log(error);
  });
