/* tslint:disable:no-console */
import { UsersService } from "src/services";
import { Container } from "typedi";
import { createConnection, useContainer as useTypeOrmContainer } from "typeorm";
import { argv } from "yargs";

useTypeOrmContainer(Container);

async function createUser() {
  const connection = await createConnection();
  try {
    const userService = Container.get(UsersService);
    const { login, password } = argv as { [x: string]: string };

    await userService.create({ login, password });

    console.log("User created: ", { login, password });
  } catch (e) {
    throw e;
  } finally {
    await connection.close();
  }
}

// tslint:disable-next-line
createUser();
