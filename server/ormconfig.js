require('dotenv').config();
const { SnakeNamingStrategy } = require('./util/typeorm-config');

// get env vars
const {
    DB_TYPE,
    DB_PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
} = process.env;

// export opts
module.exports = {
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    "src/models/**/*.ts"
  ],
  migrations: [
    "migrations/**/*.ts"
  ],
  cli: {
    migrationsDir: "migrations"
  }
};

