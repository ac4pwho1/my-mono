import express from "express";
import { PrismaClient } from "@prisma/client";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();
const prisma = new PrismaClient();

const schema = buildSchema(`
  type User {
    id: Int
    name: String
    email: String
  }

  type Query {
    users: [User]
  }
`);

const root = {
  users: async () => {
    return await prisma.user.findMany();
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app
  .listen(8787, () => {
    console.log("Server is running on http://localhost:8787/graphql");
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
