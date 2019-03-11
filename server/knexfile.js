require('dotenv').config();
const { knexSnakeCaseMappers } = require("objection");
const { snakeCase } = require("lodash");

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
} = process.env;

const defaults = {
    client: 'postgres',
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    },
    ...knexSnakeCaseMappers(),
};

module.exports = {

    development: {
        ...defaults,
        debug: true,
        useNullAsDefault: true,
    },

    production: {
        ...defaults,
        debug: false,
        useNullAsDefault: true,
    },

    onUpdateTrigger: table => `
        CREATE TRIGGER ${snakeCase(table)}_updated_at
        BEFORE UPDATE ON "${snakeCase(table)}"
        FOR EACH ROW
        EXECUTE PROCEDURE on_update_timestamp();
    `,
    dropUpdateTrigger: table => `
        DROP TRIGGER ${snakeCase(table)}_updated_at ON "${snakeCase(table)}";
    `

};