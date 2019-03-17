import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const DEFAULT_PORT = 3000;
const DEFAULT_ENV = "development";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_JWT_SECRET = "jwt-secret-key";

const ENV = process.env.NODE_ENV || DEFAULT_ENV;

const IS_DEV = ENV === "development";
const IS_PROD = ENV === "production";
const IS_TEST = ENV === "test";

{
  const defaultEnvFilePath = path.join(__dirname, "../.env");
  const specificEnvFilePath = path.join(__dirname, `../.env.${ENV}`);
  const specificEnvFileExists = fs.existsSync(specificEnvFilePath);
  const envFilePath = specificEnvFileExists
    ? specificEnvFilePath
    : defaultEnvFilePath;

  dotenv.config({ path: envFilePath });
}

const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const HOST = process.env.HOST || DEFAULT_HOST;
const PG_URL = process.env.PG_URL;
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

const config = {
  ENV,
  PORT,
  HOST,
  PG_URL,
  IS_DEV,
  IS_PROD,
  IS_TEST,
  JWT_SECRET
};

if (!IS_TEST) {
  console.table(config);
}

export = config;
