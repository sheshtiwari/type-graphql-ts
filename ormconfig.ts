import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { PG_URL } from "./src/config";

const SRC_PATH = "./src";

const config: PostgresConnectionOptions = {
  type: "postgres",
  url: PG_URL,
  logging: true,
  synchronize: true,
  entities: [`${SRC_PATH}/entities/*.entity.ts`],
  migrations: [`${SRC_PATH}/db/migrations/*.ts`],
  cli: {
    migrationsDir: `${SRC_PATH}/db/migrations`,
    entitiesDir: `${SRC_PATH}/entities`
  }
};

export = config;
