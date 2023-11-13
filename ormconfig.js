/* eslint-disable @typescript-eslint/no-var-requires */

// ==Hope env vars set in the cloud servers(dev, prod) are automatically loaded== (Finger crossed!!!)
// ==Synchronize will still happen in dev regardless
// ==Migrations will automatically run in prod

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
} // local machine setup - .env.development file is required for migrations(don't want to hardcode)

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities:
    process.env.NODE_ENV === 'test' ? ['**/*.entity.ts'] : ['**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
  synchronize: !isProduction, // Synchronize only in non-production environments
  migrationsRun: isProduction, // Automatically run migrations in production
};

console.log(process.env.NODE_ENV);
console.log(config);

module.exports = config;

// const isProduction = process.env.NODE_ENV === 'production';
// const config = {
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities:
//     process.env.NODE_ENV === 'test'
//       ? ['src/**/*.entity{.ts,.js}']
//       : ['dist/**/*.entity{.ts,.js}'],
//   migrations: ['dist/src/migrations/*{.ts,.js}'],
//   cli: {
//     migrationsDir: 'src/migrations',
//   },
//   synchronize: !isProduction, // Synchronize only in non-production environments
//   migrationsRun: isProduction, // Automatically run migrations in production
// };
