import { DataSource } from 'typeorm';
import { config } from './config';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.PGHOST,
  port: config.PGPORT,
  username: config.PGUSER,
  password: config.PGPASSWORD,
  database: config.PGDB,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'custom_migrations',
});

export default AppDataSource;
