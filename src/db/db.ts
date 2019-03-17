import { createConnection, getConnection } from "typeorm";
import * as config from "../../ormconfig";

export const dbConnect = () => createConnection(config);
export const dbDisconnect = () => getConnection().close();
export const runMigrations = () => getConnection().runMigrations();
export const undoMigrations = () => getConnection().undoLastMigration();
export const dropDatabase = () => getConnection().dropDatabase();
