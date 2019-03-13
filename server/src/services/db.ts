import knex from 'knex';
const knexConfigs = require('../../knexfile');

const env = () => process.env.NODE_ENV || 'development';

const knexConfig = knexConfigs[env()];

export default knex(knexConfig);