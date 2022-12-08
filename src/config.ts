import * as dotenv from 'dotenv';

dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

interface Config {
  PGUSER: string;
  PGPASSWORD: string;
  PGPORT: number;
  PGDB: string;
  PGHOST: string;
  PORT: number;
  SWAGGER_HOST: string;
  SECRET_KEY: string;
}

export const config: Config = {
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: parseInt(process.env.PGPORT),
  PGDB: process.env.PGDB,
  PGHOST: process.env.PGHOST,
  PORT: parseInt(process.env.PORT),
  SWAGGER_HOST: process.env.SWAGGER_HOST,
  SECRET_KEY: process.env.SECRET_KEY,
};
