import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { AuthChecker, buildSchema } from "type-graphql";
import { Container } from "typedi";
import { useContainer as useTypeOrmContainer } from "typeorm";
import { HOST, PORT } from "./config";
import { dbConnect } from "./db";
import { UserEntity } from "./entities";
import { AuthService, UsersService } from "./services";

export type Context = {
  req: Request;
  state: {
    user?: UserEntity;
  };
};

useTypeOrmContainer(Container);
// useTypeGraphQLContainer(Container);

const authChecker: AuthChecker<Context> = ({
  context: {
    state: { user }
  }
}) => Boolean(user);

export const bootstrap = async () => {
  await dbConnect();

  const app = express();

  const authService = Container.get(AuthService);
  const userService = Container.get(UsersService);

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/resolvers/*.ts"],
      authChecker,
      validate: false,
      container: Container
    }),
    context: async ({ req, res }) => {
      let user;

      if (req.headers.authorization) {
        const { id } = authService.verifyToken(req.headers.authorization);

        user = await userService.findOne({ id });
      }

      return {
        req,
        res,
        state: {
          user
        }
      };
    },
    playground: true
  });

  // app.use((next) => {
  //   console.log(123);
  //   next();
  // });

  server.applyMiddleware({ app });

  app.listen(PORT, HOST, () => {
    console.info(`Server running on: "${HOST}:${PORT}"`);
  });
};
